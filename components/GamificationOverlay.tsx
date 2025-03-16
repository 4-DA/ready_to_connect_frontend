"use client";

import React, { useState, useEffect } from "react";

// Define a TypeScript interface for Challenge
interface Challenge {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
}

export default function GamificationOverlay() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null
  );
  const [userLevel, setUserLevel] = useState(3);
  const [xpProgress, setXpProgress] = useState(65);
  const [unlockedBadges, setUnlockedBadges] = useState([
    { id: 1, name: "Networking Novice", icon: "🤝" },
    { id: 2, name: "Resume Rockstar", icon: "📄" },
  ]);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide overlay after 10 seconds of inactivity
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const dailyChallenges: Challenge[] = [
    {
      id: 1,
      title: "Complete Profile",
      description: "Add 3 more skills to your profile",
      xpReward: 50,
      icon: "✨",
    },
    {
      id: 2,
      title: "Apply to Internship",
      description: "Submit an application today",
      xpReward: 100,
      icon: "🚀",
    },
  ];

  const handleChallengeComplete = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setXpProgress((prev) => Math.min(prev + challenge.xpReward, 100));

    // Level up logic
    if (xpProgress + challenge.xpReward >= 100) {
      setUserLevel((prev) => prev + 1);
      setXpProgress(0);
    }

    // Simulate badge unlock
    if (challenge.id === 2) {
      setUnlockedBadges((prev) => [
        ...prev,
        {
          id: 3,
          name: "Application Ace",
          icon: "🏆",
        },
      ]);
    }

    // Clear active challenge after 3 seconds
    setTimeout(() => {
      setActiveChallenge(null);
    }, 3000);
  };

  return (
    <>
      {/* Floating button to show overlay when hidden */}
      {!isVisible && (
        <button
          onClick={toggleVisibility}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          🎮 Show Progress
        </button>
      )}

      {/* Main Overlay */}
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#252530] rounded-lg p-4 shadow-xl transition-opacity duration-500">
          {/* Hide Button */}
          <button
            onClick={toggleVisibility}
            className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-600 transition"
          >
            ✖ Hide
          </button>

          {/* XP and Level Display */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="mr-2">⭐</span>
                <span>Level {userLevel}</span>
              </div>
              <span>{xpProgress}% to next level</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">✨</span>
              Daily Challenges
            </h3>
            {dailyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-[#1a1a22] rounded-lg p-3 mb-3 flex items-center justify-between transform transition hover:scale-105"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl">{challenge.icon}</span>
                  <div>
                    <h4 className="font-medium">{challenge.title}</h4>
                    <p className="text-xs text-gray-400">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleChallengeComplete(challenge)}
                  className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-600 transition"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🏆</span>
              Unlocked Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-2 bg-[#1a1a22] rounded-lg transform transition hover:scale-110"
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <p className="text-xs mt-1 text-center">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge Completion Popup */}
          {activeChallenge && (
            <div className="fixed bottom-4 left-4 bg-purple-600 text-white p-4 rounded-lg shadow-xl flex items-center animate-bounce">
              <span className="mr-3 text-xl">✨</span>
              <div>
                <h4 className="font-semibold">Challenge Completed!</h4>
                <p className="text-sm">+{activeChallenge.xpReward} XP</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
