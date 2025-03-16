// app/api/generate-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, category } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Use the latest available model
      messages: [
        {
          role: "system",
          content:
            "You are an expert in creating educational quiz questions. Generate questions that test knowledge and understanding in the given subject area. Each question should have one clearly correct answer and several plausible but incorrect options. Provide a brief explanation for why the correct answer is right.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Extract and parse the response
    const responseText = completion.choices[0].message.content;
    let questions;

    try {
      // Try to parse the JSON directly
      if (responseText) {
        questions = JSON.parse(responseText);
      } else {
        throw new Error("Response text is null");
      }
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = responseText?.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse GPT response as JSON");
      }
    }

    // Validate the questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid questions format received");
    }

    // Check if each question has the required fields
    const validQuestions = questions.filter(
      (q) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length >= 3 &&
        typeof q.correctAnswerIndex === "number" &&
        q.explanation
    );

    if (validQuestions.length === 0) {
      throw new Error("No valid questions could be parsed from the response");
    }

    return NextResponse.json({
      questions: validQuestions,
      category,
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
