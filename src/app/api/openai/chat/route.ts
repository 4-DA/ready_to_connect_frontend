// app/api/openai/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
  });

  return NextResponse.json({
    text: completion.choices[0]?.message?.content ?? "",
  });
}
