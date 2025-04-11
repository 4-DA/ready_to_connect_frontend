"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import GamificationOverlay from "@/components/GamificationOverlay";
import { motion } from "framer-motion";
import {
  Send as SendIcon,
  VolumeUp as VolumeIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from "@mui/icons-material";

// -------------------
// Helper fetch calls
// -------------------
async function postChat(messages: { role: string; content: string }[]) {
  const res = await fetch("/api/openai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(`Chat error ${res.status}`);
  const { text } = await res.json();
  return text;
}

async function postTTS(text: string) {
  const res = await fetch("/api/openai/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`TTS error ${res.status}`);
  return await res.blob();
}

async function postTranscribe(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/openai/transcribe", {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Transcribe error ${res.status}`);
  const { text } = await res.json();
  return text;
}

// -------------------
// Types
// -------------------
interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

// -------------------
// Component
// -------------------
export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey there! I'm RTC, your AI Pocket Career Mentor. Ready to chat about your career goals? 🚀",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const cleanupVoiceRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
    setIsListening(false);
  };

  // Toggle voice mode
  useEffect(() => {
    if (voiceMode) startListening();
    else cleanupVoiceRecording();
    return cleanupVoiceRecording;
  }, [voiceMode]);

  // Send a message (user‐typed or transcribed)
  const handleSendMessage = async (userInput?: string) => {
    const finalInput = userInput ?? input;
    if (!finalInput.trim()) return;

    setInput("");
    setMessages((m) => [
      ...m,
      { text: finalInput, isUser: true, timestamp: getCurrentTime() },
    ]);

    setIsProcessing(true);
    setMessages((m) => [
      ...m,
      { text: "Thinking...", isUser: false, timestamp: getCurrentTime() },
    ]);

    try {
      const aiText = await postChat([
        { role: "system", content: "You are RTC, an AI career mentor. Provide concise advice." },
        { role: "user", content: finalInput },
      ]);

      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((x) => x.text === "Thinking...");
        if (idx >= 0) copy.splice(idx, 1);
        copy.push({ text: aiText, isUser: false, timestamp: getCurrentTime() });
        return copy;
      });

      if (voiceMode) await speakText(aiText);
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((x) => x.text === "Thinking...");
        if (idx >= 0) copy.splice(idx, 1);
        copy.push({ text: "Sorry, something went wrong.", isUser: false, timestamp: getCurrentTime() });
        return copy;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Speak text via TTS endpoint
  const speakText = async (text: string) => {
    cleanupVoiceRecording();
    setIsSpeaking(true);
    setMessages((m) => [
      ...m,
      { text: "Speaking...", isUser: false, timestamp: getCurrentTime() },
    ]);

    try {
      const blob = await postTTS(text);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      setMessages((prev) => prev.filter((m) => m.text !== "Speaking..."));
      audio.play();
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
        if (voiceMode) startListening();
      };
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
      setMessages((m) => [
        ...m.filter((x) => x.text !== "Speaking..."),
        { text: "TTS failed.", isUser: false, timestamp: getCurrentTime() },
      ]);
      if (voiceMode) startListening();
    }
  };

  // Record, stop after 8s, and transcribe via Whisper endpoint
  const startListening = async () => {
    if (isListening || isSpeaking || isProcessing) return;
    cleanupVoiceRecording();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setIsListening(false);
        setMessages((m) => m.filter((x) => x.text !== "Listening..."));

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (blob.size < 1000) {
          if (voiceMode) startListening();
          return;
        }

        setIsProcessing(true);
        setMessages((m) => [
          ...m,
          { text: "Processing your speech...", isUser: false, timestamp: getCurrentTime() },
        ]);

        try {
          const file = new File([blob], "rec.webm", { type: "audio/webm" });
          const transcript = await postTranscribe(file);
          setMessages((m) => m.filter((x) => x.text !== "Processing your speech..."));
          await handleSendMessage(transcript);
        } catch (e) {
          console.error(e);
          setMessages((m) => [
            ...m.filter((x) => x.text !== "Processing your speech..."),
            { text: "Speech processing failed.", isUser: false, timestamp: getCurrentTime() },
          ]);
        } finally {
          setIsProcessing(false);
          if (voiceMode) startListening();
        }
      };

      recorder.start(1000);
      setIsListening(true);
      setMessages((m) => [
        ...m,
        { text: "Listening...", isUser: false, timestamp: getCurrentTime() },
      ]);

      listeningTimeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 8000);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { text: "Mic access denied.", isUser: false, timestamp: getCurrentTime() },
      ]);
      setVoiceMode(false);
    }
  };

  // Toggle voice mode on/off
  const toggleVoiceMode = async () => {
    if (!voiceMode) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setVoiceMode(true);
      } catch {
        setMessages((m) => [
          ...m,
          { text: "Allow mic to enable voice mode.", isUser: false, timestamp: getCurrentTime() },
        ]);
      }
    } else {
      setVoiceMode(false);
    }
  };

  // ---------
  // Render
  // ---------
  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={toggleVoiceMode}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${
              voiceMode ? "bg-green-600" : "bg-gray-600"
            } ${isProcessing ? "opacity-50" : ""}`}
          >
            {voiceMode ? <MicIcon /> : <MicOffIcon />}
            {voiceMode ? "Voice ON 🎙️" : "Enable Voice Mode"}
            {isListening && <span className="ml-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />}
          </button>
          <div className="flex items-center gap-4">
            <Image src="/Jane-doe.png" alt="profile" width={50} height={50} className="rounded-full" />
            <span className="text-sm">John Doe</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col h-[calc(100vh-200px)]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    msg.isUser ? "bg-purple-500 text-white" : "bg-[#252530] text-gray-200"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                  {!msg.isUser &&
                    ![
                      "Thinking...",
                      "Listening...",
                      "Speaking...",
                      "Processing your speech...",
                    ].includes(msg.text) && (
                      <button
                        onClick={() => speakText(msg.text)}
                        disabled={isSpeaking || isProcessing}
                        className="mt-2 text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        <VolumeIcon /> Listen
                      </button>
                    )}
                </div>
              </motion.div>
            ))}
          </div>

          {!voiceMode && (
            <div className="mt-auto flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isProcessing && handleSendMessage()}
                placeholder="Ask me about careers, internships, or skills!"
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-[#252530] rounded-md text-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isProcessing || isSpeaking}
                className="p-2 bg-purple-500 rounded-md"
              >
                <SendIcon />
              </button>
            </div>
          )}

          {voiceMode && (
            <div className="mt-auto py-3 bg-[#252530] rounded-md text-center">
              {isListening
                ? "Listening… speak now"
                : isSpeaking
                ? "Speaking…"
                : isProcessing
                ? "Processing…"
                : "Voice mode active. Click mic to disable."}
            </div>
          )}
        </div>
      </div>
      <GamificationOverlay />
    </div>
  );
}