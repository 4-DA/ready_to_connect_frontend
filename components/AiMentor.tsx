'use client';

import { useState } from 'react';
import { Send as SendIcon, SmartToy as BotIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import Image from 'next/image';

export default function AIMentor() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI Mentor. How can I assist you with your career or life goals today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response (replace with GPT API call in your implementation)
    setTimeout(() => {
      const aiResponse = {
        text: "I'm here to help! Could you tell me more about what you're looking for advice on?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar/> 

      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          {/* Search input field */}
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white focus:outline-none"
          />
          <div className="flex items-center gap-4">
            {/* Circular image next to John Doe */} 

            <Image
            src="/Jane-doe.png" 
            alt="profile" 
            height={80} 
            width ={80} 
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
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-purple-500 text-white'
                    : 'bg-[#252530] text-gray-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about jobs or life advice..."
            className="flex-1 px-4 py-2 bg-[#252530] rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
          >
            <SendIcon className="text-white" />
          </button>
        </div>
      </div>
    </div>
    </div>
    
  );
}