"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useGameStore } from "@/contexts/GameContext";

// Match interface with what's in GameContext
interface GameChallenge {
  id: number;
  title: string;
  description: string;
  pointsAvailable: number;
  icon: string;
  completed?: boolean;
}

// For internal use - handles both formats
interface Challenge {
  id: number;
  title: string;
  description: string;
  pointsAvailable?: number;
  xpReward?: number;
  icon: string;
  completed?: boolean;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
}

export default function GamificationOverlay() {
  const { isAuthenticated, token, user } = useAuth();
  const { level, points, badges, setGameData, fetchGameData } = useGameStore();
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null
  );
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const xpPerLevel = 100;
  const xpProgress = Math.min(((points % xpPerLevel) / xpPerLevel) * 100, 100);

  // Convert API challenges to match expected format
  const normalizeChallenges = (challenges: any[]): Challenge[] => {
    return challenges.map((challenge) => ({
      ...challenge,
      // Ensure both properties exist for compatibility
      pointsAvailable: challenge.pointsAvailable || challenge.xpReward || 10,
      xpReward: challenge.xpReward || challenge.pointsAvailable || 10,
    }));
  };

  // Load data function
  const loadData = useCallback(async () => {
    setIsLoading(true);
    console.log("GamificationOverlay - Loading data, token:", !!token);

    try {
      // Attempt to load data if we have a token or if we already have some game data
      if (token || points > 0 || level > 0 || badges.length > 0) {
        if (token) {
          // Ensure authorization header is set
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Load game data first
          await fetchGameData(token);

          // Then fetch challenges
          try {
            const challengesResponse = await api.get(
              "/gamification/daily-challenges/"
            );
            const normalizedChallenges = normalizeChallenges(
              challengesResponse.data
            );
            setDailyChallenges(normalizedChallenges);
          } catch (challengeError) {
            console.error("Error loading challenges:", challengeError);
          }
        }
      }
    } catch (error) {
      console.error("Error loading gamification data:", error);
      if (isAuthenticated && token) {
        toast.error("Failed to load gamification data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, points, level, badges.length, fetchGameData]);

  // Initial data loading
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for authentication state changes
  useEffect(() => {
    const handleAuthStateChange = () => {
      console.log("GamificationOverlay: Auth state changed, reloading data");
      loadData();
    };

    window.addEventListener("auth-state-changed", handleAuthStateChange);
    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
    };
  }, [loadData]);

  // Auto-hide timer
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
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

      // Refresh user data if global function exists
      if (typeof (globalThis as any).refreshUserData === "function") {
        await (globalThis as any).refreshUserData();
      }

      // Notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("game-data-updated"));
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

    // Get reward points from either property
    const rewardPoints = challenge.pointsAvailable || challenge.xpReward || 10;

    setActiveChallenge(challenge);
    const newPoints = points + rewardPoints;
    const newLevel = Math.floor(newPoints / xpPerLevel) + 1;

    // Update game data
    setGameData({ points: newPoints, level: newLevel });

    // Level up notification
    if (newPoints >= newLevel * xpPerLevel) {
      toast.success(`Level Up! You're now Level ${newLevel}!`);
    }

    // Badge unlock logic
    if (challenge.id === 2 && !badges.some((b) => b.id === 3)) {
      const newBadge = { id: 3, name: "Application Ace", icon: "🏆" };
      setGameData({ badges: [...badges, newBadge] });
      toast.success(`Badge Unlocked: ${newBadge.name}!`);
    }

    // Save progress to server
    await saveChallengeProgress(rewardPoints);

    // Update local state
    setDailyChallenges((prev) =>
      prev.map((c) => (c.id === challenge.id ? { ...c, completed: true } : c))
    );

    // Hide notification after delay
    setTimeout(() => setActiveChallenge(null), 3000);
  };

  // Enhanced loading state with spinner
  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-[#252530] rounded-lg p-4 shadow-xl">
        <div className="text-white flex items-center">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>
          Loading gamification data...
        </div>
      </div>
    );
  }

  // Check if user is authenticated
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
                <p className="text-sm">
                  +{activeChallenge.pointsAvailable || activeChallenge.xpReward}{" "}
                  XP
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
