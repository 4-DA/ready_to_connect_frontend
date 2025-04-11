// src/app/api/generate-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// 1) Make sure we have a secret key on the server
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

// 2) Initialize OpenAI on the server only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 3) Define your request + response types
interface GenerateQuestionsRequest {
  prompt: string;
  category?: string;
}

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

    // 4) Ask OpenAI for your JSON‐strict quiz
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in creating educational quiz questions. Each question must include a 'question' (string), 'options' (an array), 'correctAnswerIndex' (number), and 'explanation' (string). Respond strictly in JSON format.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
    }

    // 5) Parse & validate
    let questions: Question[] | undefined;
    try {
      const parsed = JSON.parse(responseText);
      questions = Array.isArray(parsed) ? parsed : parsed.questions;
    } catch (parseError) {
      if (process.env.NODE_ENV === "development") {
        console.error("JSON Parse Error:", parseError);
        console.log("Raw OpenAI response:", responseText);
      }
      return NextResponse.json({ error: "Failed to parse questions" }, { status: 500 });
    }

    if (!questions?.length) {
      return NextResponse.json({ error: "Invalid or empty questions received" }, { status: 400 });
    }

    // 6) Filter out any malformed entries
    const validQuestions = questions.filter(
      (q) =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length >= 3 &&
        typeof q.correctAnswerIndex === "number" &&
        typeof q.explanation === "string"
    );

    if (!validQuestions.length) {
      return NextResponse.json({ error: "No valid questions parsed" }, { status: 400 });
    }

    // 7) Return!
    return NextResponse.json({
      questions: validQuestions,
      category: category ?? null,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected Error in /api/generate-questions:", error);
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
