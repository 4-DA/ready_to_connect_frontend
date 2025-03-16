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

    // Simulated AI response
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
      <div className="flex-1 p-6 md:pl-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center gap-4">
            <Image
              src="/Jane-doe.png"
              alt="profile"
              height={40}
              width={40}
              className="rounded-full border-2 border-purple-500"
            />
            <div className="text-sm font-semibold">John Doe</div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex flex-col h-[75vh] bg-[#1a1a22] p-4 rounded-lg shadow-lg">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    message.isUser
                      ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                      : "bg-[#252530] text-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="mt-4 flex items-center gap-2 bg-[#252530] p-3 rounded-lg shadow-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about jobs or life advice..."
              className="flex-1 px-4 py-2 bg-[#1a1a22] rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-purple-500 rounded-full hover:bg-purple-600 transition-all shadow-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
