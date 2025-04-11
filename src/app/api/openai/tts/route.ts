import { NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { text } = await req.json();
  const audio = await openai.audio.speech.create({
    model: "tts-1",
    input: text,
    voice: "alloy",
    speed: 1.0,
  });
  const blob = await audio.blob();
  return new NextResponse(blob, {
    headers: { "Content-Type": "audio/webm" },
  });
}
