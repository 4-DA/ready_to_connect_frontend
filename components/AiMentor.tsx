"use client";
import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import GamificationOverlay from "@/components/GamificationOverlay";

export default function AIMentor() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI Mentor. How can I assist you with your career or life goals today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse = {
        text: "I'm here to help! Could you tell me more about what you're looking for advice on?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />
      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <Image
              src="/Jane-doe.png"
              alt="profile"
              height={80}
              width={80}
              className="rounded-full"
            />
            <div className="text-sm">John Doe</div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-purple-500 text-white"
                      : "bg-[#252530] text-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about jobs or life advice..."
              className="flex-1 px-4 py-2 bg-[#252530] rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <GamificationOverlay />
    </div>
  );
}
