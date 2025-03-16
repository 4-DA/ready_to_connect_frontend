"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
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
import { OpenAI } from "openai";

// Initialize OpenAI with API key
// IMPORTANT: For production, use environment variables instead of hardcoding
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

// Define TypeScript types
interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey there! I'm RTC, your AI Pocket Career Mentor. Ready to chat about your career goals? 🚀",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [voiceMode, setVoiceMode] = useState<boolean>(false);

  // Use refs for better memory management
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to get current timestamp
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Cleanup function for voice recording
  const cleanupVoiceRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = null;
    }

    setIsListening(false);
  };

  // Handle voice mode toggle
  useEffect(() => {
    const setupVoiceMode = async () => {
      if (voiceMode) {
        await startListening();
      } else {
        cleanupVoiceRecording();
      }
    };

    setupVoiceMode();

    // Cleanup on component unmount
    return () => {
      cleanupVoiceRecording();
    };
  }, [voiceMode]);

  const handleSendMessage = async (userInput?: string) => {
    const finalInput = userInput || input;
    if (!finalInput.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      text: finalInput,
      isUser: true,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Add thinking message
    setIsProcessing(true);
    setMessages((prev) => [
      ...prev,
      {
        text: "Thinking...",
        isUser: false,
        timestamp: getCurrentTime(),
      },
    ]);

    try {
      // Get AI response
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are RTC, an AI career mentor. Provide helpful, concise career advice.",
          },
          { role: "user", content: finalInput },
        ],
      });

      const aiText =
        response.choices[0]?.message?.content ||
        "I didn't quite get that. Can you rephrase?";

      // Remove thinking message and add AI response
      setMessages((prev) => {
        const newMessages = [...prev];
        // Find and remove the "Thinking..." message
        const thinkingIndex = newMessages.findIndex(
          (msg) => !msg.isUser && msg.text === "Thinking..."
        );
        if (thinkingIndex !== -1) {
          newMessages.splice(thinkingIndex, 1);
        }

        return [
          ...newMessages,
          {
            text: aiText,
            isUser: false,
            timestamp: getCurrentTime(),
          },
        ];
      });

      // Speak response if in voice mode
      if (voiceMode) {
        await speakText(aiText);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Remove thinking message and add error message
      setMessages((prev) => {
        const newMessages = [...prev];
        // Find and remove the "Thinking..." message
        const thinkingIndex = newMessages.findIndex(
          (msg) => !msg.isUser && msg.text === "Thinking..."
        );
        if (thinkingIndex !== -1) {
          newMessages.splice(thinkingIndex, 1);
        }

        return [
          ...newMessages,
          {
            text: "Sorry, I encountered an error. Please try again.",
            isUser: false,
            timestamp: getCurrentTime(),
          },
        ];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string): Promise<void> => {
    // Stop listening while speaking
    cleanupVoiceRecording();

    try {
      setIsSpeaking(true);

      // Add speaking indicator
      setMessages((prev) => [
        ...prev,
        {
          text: "Speaking...",
          isUser: false,
          timestamp: getCurrentTime(),
        },
      ]);

      // Get audio from OpenAI
      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        input: text,
        voice: "alloy",
        speed: 1.0,
      });

      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Remove speaking indicator
      setMessages((prev) => {
        const newMessages = [...prev];
        const speakingIndex = newMessages.findIndex(
          (msg) => !msg.isUser && msg.text === "Speaking..."
        );
        if (speakingIndex !== -1) {
          newMessages.splice(speakingIndex, 1);
        }
        return newMessages;
      });

      // Play audio
      audio.play();

      // When audio finishes
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl); // Clean up

        // Restart listening if still in voice mode
        if (voiceMode) {
          startListening();
        }
      };
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsSpeaking(false);

      // Remove speaking indicator if exists
      setMessages((prev) => {
        const newMessages = [...prev];
        const speakingIndex = newMessages.findIndex(
          (msg) => !msg.isUser && msg.text === "Speaking..."
        );
        if (speakingIndex !== -1) {
          newMessages.splice(speakingIndex, 1);
        }

        return [
          ...newMessages,
          {
            text: "Sorry, I couldn't generate speech. Please check your connection.",
            isUser: false,
            timestamp: getCurrentTime(),
          },
        ];
      });

      // Try to restart listening if in voice mode
      if (voiceMode) {
        startListening();
      }
    }
  };

  const startListening = async () => {
    // Don't start if already listening or speaking
    if (isListening || isSpeaking || isProcessing) return;

    try {
      // Clean up any existing recording session
      cleanupVoiceRecording();

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Create new recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      recorderRef.current = mediaRecorder;

      // Add listening indicator
      setMessages((prev) => [
        ...prev,
        {
          text: "Listening...",
          isUser: false,
          timestamp: getCurrentTime(),
        },
      ]);

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Process recorded audio
        if (audioChunksRef.current.length > 0) {
          // Remove listening indicator
          setMessages((prev) => {
            const newMessages = [...prev];
            const listeningIndex = newMessages.findIndex(
              (msg) => !msg.isUser && msg.text === "Listening..."
            );
            if (listeningIndex !== -1) {
              newMessages.splice(listeningIndex, 1);
            }
            return newMessages;
          });

          // Add processing indicator
          setMessages((prev) => [
            ...prev,
            {
              text: "Processing your speech...",
              isUser: false,
              timestamp: getCurrentTime(),
            },
          ]);

          setIsProcessing(true);

          try {
            // Create audio blob and transcribe
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });

            // Skip processing if blob is too small (likely no speech)
            if (audioBlob.size < 1000) {
              console.log("Audio too short, ignoring");

              // Remove processing indicator
              setMessages((prev) => {
                const newMessages = [...prev];
                const processingIndex = newMessages.findIndex(
                  (msg) =>
                    !msg.isUser && msg.text === "Processing your speech..."
                );
                if (processingIndex !== -1) {
                  newMessages.splice(processingIndex, 1);
                }
                return newMessages;
              });

              // Restart listening
              if (voiceMode && !isSpeaking) {
                startListening();
              }
              return;
            }

            // Use Whisper API for transcription
            const transcription = await openai.audio.transcriptions.create({
              file: new File([audioBlob], "recording.webm", {
                type: "audio/webm",
              }),
              model: "whisper-1",
            });

            // Remove processing indicator
            setMessages((prev) => {
              const newMessages = [...prev];
              const processingIndex = newMessages.findIndex(
                (msg) => !msg.isUser && msg.text === "Processing your speech..."
              );
              if (processingIndex !== -1) {
                newMessages.splice(processingIndex, 1);
              }
              return newMessages;
            });

            const transcript = transcription.text.trim();

            if (transcript) {
              await handleSendMessage(transcript);
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  text: "I didn't hear anything. Please try speaking again.",
                  isUser: false,
                  timestamp: getCurrentTime(),
                },
              ]);

              // Restart listening
              if (voiceMode && !isSpeaking) {
                startListening();
              }
            }
          } catch (error) {
            console.error("Error processing speech:", error);

            // Remove processing indicator
            setMessages((prev) => {
              const newMessages = [...prev];
              const processingIndex = newMessages.findIndex(
                (msg) => !msg.isUser && msg.text === "Processing your speech..."
              );
              if (processingIndex !== -1) {
                newMessages.splice(processingIndex, 1);
              }
              return newMessages;
            });

            setMessages((prev) => [
              ...prev,
              {
                text: "Sorry, I couldn't process your speech. Please try again.",
                isUser: false,
                timestamp: getCurrentTime(),
              },
            ]);

            // Restart listening
            if (voiceMode && !isSpeaking) {
              startListening();
            }
          } finally {
            setIsProcessing(false);
          }
        } else {
          // No audio data, just restart listening
          if (voiceMode && !isSpeaking && !isProcessing) {
            // Remove listening indicator first
            setMessages((prev) => {
              const newMessages = [...prev];
              const listeningIndex = newMessages.findIndex(
                (msg) => !msg.isUser && msg.text === "Listening..."
              );
              if (listeningIndex !== -1) {
                newMessages.splice(listeningIndex, 1);
              }
              return newMessages;
            });
            startListening();
          }
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data in 1-second chunks
      setIsListening(true);

      // Auto-stop after 8 seconds to process what was said
      listeningTimeoutRef.current = setTimeout(() => {
        if (recorderRef.current && recorderRef.current.state === "recording") {
          recorderRef.current.stop();
        }
      }, 8000);
    } catch (error) {
      console.error("Error starting microphone:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I couldn't access your microphone. Please check your browser permissions.",
          isUser: false,
          timestamp: getCurrentTime(),
        },
      ]);
      setVoiceMode(false);
    }
  };

  const toggleVoiceMode = async () => {
    if (!voiceMode) {
      try {
        // Test microphone access before enabling
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setVoiceMode(true);
      } catch (error) {
        console.error("Microphone access denied:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "I need microphone access for voice mode. Please allow it in your browser settings.",
            isUser: false,
            timestamp: getCurrentTime(),
          },
        ]);
      }
    } else {
      setVoiceMode(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />
      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceMode}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${
                voiceMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {voiceMode ? <MicIcon /> : <MicOffIcon />}
              {voiceMode ? "Voice Mode ON 🎙️" : "Enable Voice Mode"}
              {isListening && (
                <span className="ml-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/Jane-doe.png"
              alt="profile"
              height={50}
              width={50}
              className="rounded-full"
            />
            <div className="text-sm">John Doe</div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col h-[calc(100vh-200px)]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    message.isUser
                      ? "bg-purple-500 text-white"
                      : "bg-[#252530] text-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp}
                  </p>

                  {/* Listen button for AI messages that aren't status messages */}
                  {!message.isUser &&
                    ![
                      "Thinking...",
                      "Listening...",
                      "Speaking...",
                      "Processing your speech...",
                    ].includes(message.text) && (
                      <button
                        onClick={() => speakText(message.text)}
                        disabled={isSpeaking || isProcessing}
                        className={`mt-2 text-gray-400 hover:text-white flex items-center gap-1 ${
                          isSpeaking || isProcessing
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <VolumeIcon className="text-white" /> Listen
                      </button>
                    )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area (Hidden in voice mode) */}
          {!voiceMode && (
            <div className="mt-auto flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isProcessing && handleSendMessage()
                }
                placeholder="Ask me about careers, internships, or skills!"
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 bg-[#252530] rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isProcessing ? "opacity-50" : ""
                }`}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isProcessing || isSpeaking}
                className={`p-2 rounded-md transition-colors ${
                  !input.trim() || isProcessing || isSpeaking
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
              >
                <SendIcon className="text-white" />
              </button>
            </div>
          )}

          {/* Voice Mode Indicator */}
          {voiceMode && (
            <div className="mt-auto flex justify-center items-center gap-2 py-3 bg-[#252530] rounded-md">
              {isListening ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening... Speak now</span>
                </div>
              ) : isSpeaking ? (
                <span>RTC is speaking...</span>
              ) : isProcessing ? (
                <span>Processing...</span>
              ) : (
                <span>Voice mode active. Click microphone to disable.</span>
              )}
            </div>
          )}
        </div>
      </div>
      <GamificationOverlay />
    </div>
  );
}
