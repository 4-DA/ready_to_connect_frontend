// app/api/generate-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Comprehensive API key check
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ CRITICAL: OpenAI API Key is missing!");
}

// Safer OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Log the incoming request
    console.log("Received question generation request");

    const { prompt, category } = await request.json();

    // Validate prompt
    if (!prompt) {
      console.warn("❗ Question generation failed: No prompt provided");
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Attempt OpenAI API call with more robust error handling
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in creating educational quiz questions. Generate questions that test knowledge and understanding in the given subject area. Each question should have one clearly correct answer and several plausible but incorrect options. Provide a brief explanation for why the correct answer is right. Respond ONLY with a valid JSON array of question objects.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        // Add response format hint for more consistent output
        response_format: { type: "json_object" },
      });
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError);
      return NextResponse.json(
        {
          error: "Failed to communicate with OpenAI",
          details:
            apiError instanceof Error ? apiError.message : String(apiError),
        },
        { status: 500 }
      );
    }

    // Extract response text
    const responseText = completion.choices[0].message.content;

    if (!responseText) {
      console.warn("❗ No response text received from OpenAI");
      return NextResponse.json(
        { error: "No response generated" },
        { status: 500 }
      );
    }

    // Robust JSON parsing
    let questions;
    try {
      // Attempt to parse the response
      questions = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      console.log("Problematic response text:", responseText);

      return NextResponse.json(
        {
          error: "Failed to parse questions",
          rawResponse: responseText,
        },
        { status: 500 }
      );
    }

    // Validate questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      console.warn("❗ Invalid questions format");
      return NextResponse.json(
        { error: "Invalid questions format received" },
        { status: 400 }
      );
    }

    // Strict question validation
    const validQuestions = questions.filter(
      (q) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length >= 3 &&
        typeof q.correctAnswerIndex === "number" &&
        q.explanation
    );

    if (validQuestions.length === 0) {
      console.warn("❗ No valid questions could be parsed");
      return NextResponse.json(
        { error: "No valid questions could be parsed" },
        { status: 400 }
      );
    }

    // Successful response
    console.log(`✅ Successfully generated ${validQuestions.length} questions`);
    return NextResponse.json({
      questions: validQuestions,
      category,
    });
  } catch (error) {
    // Catch-all error handler
    console.error("Unexpected error in question generation:", error);
    return NextResponse.json(
      {
        error: "Unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
