// src/app/api/generate-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Now uses environment variable
});

// Strong typing for the incoming request body
interface GenerateQuestionsRequest {
  prompt: string;
  category?: string;
}

// Strong typing for individual question
interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionsRequest = await request.json();

    const { prompt, category } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in creating educational quiz questions. Each question must have: question (string), options (array), correctAnswerIndex (number), explanation (string). Respond in JSON format.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;

    if (!responseText) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
    }

    let questions: Question[] | undefined;

    try {
      const parsed = JSON.parse(responseText);
      questions = Array.isArray(parsed) ? parsed : parsed?.questions;
    } catch (parseError) {
      if (process.env.NODE_ENV === "development") {
        console.error("JSON Parse Error:", parseError);
        console.log("Raw OpenAI response:", responseText);
      }
      return NextResponse.json({ error: "Failed to parse questions" }, { status: 500 });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Invalid or empty questions received" }, { status: 400 });
    }

    // Filter to ensure data is safe
    const validQuestions = questions.filter(
      (q) =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length >= 3 &&
        typeof q.correctAnswerIndex === "number" &&
        typeof q.explanation === "string"
    );

    if (validQuestions.length === 0) {
      return NextResponse.json({ error: "No valid questions parsed" }, { status: 400 });
    }

    return NextResponse.json({
      questions: validQuestions,
      category: category || null,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected Error:", error);
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
