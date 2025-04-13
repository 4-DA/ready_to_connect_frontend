"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useGameStore } from "@/contexts/GameContext";

interface Challenge {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  completed?: boolean;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
}

export default function GamificationOverlay() {
  const { isAuthenticated, token } = useAuth();
  const { level, points, badges, setGameData, fetchGameData } = useGameStore();
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null
  );
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const xpPerLevel = 100;
  const xpProgress = Math.min(((points % xpPerLevel) / xpPerLevel) * 100, 100);

  // Load data function
  const loadData = async () => {
    setIsLoading(true);

    try {
      // Attempt to load data if we have a token or if we already have some game data
      if (token || points > 0 || level > 0 || badges.length > 0) {
        if (token) {
          await fetchGameData(token);
          const challengesResponse = await api.get(
            "/gamification/daily-challenges/"
          );
          setDailyChallenges(challengesResponse.data);
        }
      }
    } catch (error) {
      console.error("Error loading gamification data:", error);
      // Only show error if we're pretty sure user is logged in
      if (isAuthenticated && token) {
        toast.error("Failed to load gamification data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    loadData();

    // Listen for authentication state changes
    const handleAuthStateChange = () => {
      loadData();
    };

    window.addEventListener("auth-state-changed", handleAuthStateChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
    };
  }, [token]); // Only re-run if token changes

  useEffect(() => {
    if (!isVisible || isLoading) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isVisible, isLoading]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const saveChallengeProgress = async (xpGained: number) => {
    if (!token) {
      console.error("No auth token found.");
      toast.error("Please log in to save progress.");
      return;
    }
    try {
      const response = await api.post("/gamification/quiz-progress/", {
        xp: xpGained,
        streak: 1,
      });
      const result = response.data;
      console.log("✅ Challenge progress saved:", result);
      setGameData({
        points: result.total_xp,
        level: result.current_level,
      });
      if (typeof (globalThis as any).refreshUserData === "function") {
        await (globalThis as any).refreshUserData();
      }
      toast.success(`+${xpGained} XP saved!`);
    } catch (error) {
      console.error("❌ Error saving challenge progress:", error);
      toast.error("Failed to save challenge progress.");
    }
  };

  const handleChallengeComplete = async (challenge: Challenge) => {
    if (challenge.completed) {
      toast.error("Challenge already completed!");
      return;
    }
    setActiveChallenge(challenge);
    const newPoints = points + challenge.xpReward;
    const newLevel = Math.floor(newPoints / xpPerLevel) + 1;
    setGameData({ points: newPoints, level: newLevel });
    if (newPoints >= newLevel * xpPerLevel) {
      toast.success(`Level Up! You're now Level ${newLevel}!`);
    }
    if (challenge.id === 2 && !badges.some((b) => b.id === 3)) {
      const newBadge = { id: 3, name: "Application Ace", icon: "🏆" };
      setGameData({ badges: [...badges, newBadge] });
      toast.success(`Badge Unlocked: ${newBadge.name}!`);
    }
    await saveChallengeProgress(challenge.xpReward);
    setDailyChallenges((prev) =>
      prev.map((c) => (c.id === challenge.id ? { ...c, completed: true } : c))
    );
    setTimeout(() => setActiveChallenge(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-[#252530] rounded-lg p-4 shadow-xl">
        <div className="text-white">Loading gamification data...</div>
      </div>
    );
  }

  // Consider user authenticated if:
  // 1. They have auth context AND token, OR
  // 2. They have game data (points, level, badges)
  const userIsAuthenticated =
    (isAuthenticated && !!token) ||
    points > 0 ||
    level > 0 ||
    badges.length > 0;

  if (!userIsAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-[#252530] rounded-lg p-4 shadow-xl">
        <div className="text-white">Please log in to view gamification.</div>
      </div>
    );
  }

  return (
    <>
      {!isVisible && (
        <button
          onClick={toggleVisibility}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          🎮 Show Progress
        </button>
      )}
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#252530] rounded-lg p-4 shadow-xl transition-opacity duration-500">
          <button
            onClick={toggleVisibility}
            className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-600 transition"
          >
            ✖ Hide
          </button>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="mr-2">⭐</span>
                <span>Level {level}</span>
              </div>
              <span>{xpProgress.toFixed(0)}% to next level</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">✨</span> Daily Challenges
            </h3>
            {dailyChallenges.length > 0 ? (
              dailyChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-[#1a1a22] rounded-lg p-3 mb-3 flex items-center justify-between transform transition hover:scale-105"
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">{challenge.icon}</span>
                    <div>
                      <h4
                        className={`font-medium ${
                          challenge.completed ? "text-gray-500" : "text-white"
                        }`}
                      >
                        {challenge.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleChallengeComplete(challenge)}
                    className={`px-3 py-1 rounded-full text-sm text-white transition ${
                      challenge.completed
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-600"
                    }`}
                    disabled={challenge.completed}
                  >
                    {challenge.completed ? "Completed" : "Complete"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No challenges available today.</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🏆</span> Unlocked Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-2 bg-[#1a1a22] rounded-lg transform transition hover:scale-110"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <p className="text-xs mt-1 text-center">{badge.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-3">
                  No badges unlocked yet.
                </p>
              )}
            </div>
          </div>

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
