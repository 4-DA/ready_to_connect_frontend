"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  StarBorder as StarIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Timeline as TimelineIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import api from "@/utils/api"; // Your custom Axios instance

export default function ProgressSection() {
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [xpClaimed, setXpClaimed] = useState(false);
  const [mentorshipSessions, setMentorshipSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string>("");

  // New streak-related states
  const [streakActive, setStreakActive] = useState(true);
  const [highestStreak, setHighestStreak] = useState(0);
  const [nextMilestone, setNextMilestone] = useState<number | null>(null);
  const [daysToMilestone, setDaysToMilestone] = useState<number | null>(null);
  const [streakPercentage, setStreakPercentage] = useState(0);

  // Calculate time until next claim is available
  const calculateTimeUntilNextClaim = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Next day at midnight

    const diffMs = tomorrow.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    setTimeUntilNextClaim(`${diffHrs}h ${diffMins}m`);
  };

  // Check if XP has been claimed today directly from the server
  const checkClaimStatus = async () => {
    try {
      const response = await api.get("/gamification/claim-daily-xp/");
      const { claimed } = response.data;

      setXpClaimed(claimed);

      if (claimed) {
        calculateTimeUntilNextClaim();
      }
    } catch (err) {
      console.error("Error checking claim status:", err);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/gamification/dashboard/");
      const data = response.data;

      setStreak(data.current_streak || 0);
      setPoints(data.total_xp || 0);
      setLevel(data.current_level || 1);

      const xpInCurrentLevel = data.total_xp % 100;
      const percentToNext = (xpInCurrentLevel / 100) * 100;
      setProgress(percentToNext);

      setMentorshipSessions(data.mentorship_sessions || 0);

      // Check if XP has been claimed today
      await checkClaimStatus();

      // Fetch additional streak information
      fetchStreakInfo();
    } catch (err) {
      console.error("API error:", err);
      setError("Failed to load user data from /gamification/dashboard/.");
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch detailed streak information
  const fetchStreakInfo = async () => {
    try {
      const response = await api.get("/gamification/streak/status/");
      const streakData = response.data;

      setStreak(streakData.current_streak);
      setStreakActive(streakData.streak_active);
      setHighestStreak(streakData.highest_streak);
      setNextMilestone(streakData.next_milestone);
      setDaysToMilestone(streakData.days_to_milestone);
      setStreakPercentage(streakData.streak_percentage);

      // If streak is not active and should be reset, update UI accordingly
      if (streakData.streak_broken) {
        toast.error("⚠️ Your streak will reset if you don't earn XP today!", {
          id: "streak-warning",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch streak info:", error);
    }
  };

  // Use effect to initialize data and listen for auth changes
  useEffect(() => {
    fetchUserData();

    // Listen for authentication state changes
    const handleAuthStateChange = () => {
      fetchUserData();
    };

    window.addEventListener("auth-state-changed", handleAuthStateChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
    };
  }, []);

  // Update time counter every minute if XP is claimed
  useEffect(() => {
    if (xpClaimed) {
      calculateTimeUntilNextClaim();
      const timer = setInterval(calculateTimeUntilNextClaim, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [xpClaimed]);

  const handleClaimXP = async () => {
    if (xpClaimed) return;

    try {
      const response = await api.post("/gamification/claim-daily-xp/");
      const { xp_awarded, current_streak } = response.data;

      toast.success(`🎉 +${xp_awarded} XP claimed!`);
      setXpClaimed(true);
      calculateTimeUntilNextClaim();

      // Update streak with value from server
      setStreak(current_streak);

      // Refresh global user info if applicable
      if (typeof (globalThis as any).refreshUserData === "function") {
        await (globalThis as any).refreshUserData();
      }

      // Refresh streak info
      fetchStreakInfo();

      // Show special toast for streak milestones
      if ([3, 5, 7, 10, 15, 30, 60, 90, 180, 365].includes(current_streak)) {
        toast.success(`🔥 ${current_streak} DAY STREAK! Amazing consistency!`, {
          duration: 5000,
          icon: "🏆",
        });
      }

      await fetchUserData();
    } catch (error: any) {
      console.error("Error claiming XP:", error);

      if (error.response?.data?.detail?.includes("already claimed")) {
        toast.error("🛑 You already claimed XP today!");
        setXpClaimed(true);
        calculateTimeUntilNextClaim();
      } else {
        toast.error("❌ Failed to claim daily XP.");
      }
    }
  };

  const circumference = 2 * Math.PI * 45;
  const safeProgress = isNaN(progress) ? 0 : progress;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  // Get streak color and emoji based on length
  const getStreakVisuals = (streakCount: number) => {
    if (streakCount >= 30)
      return {
        color: "text-purple-500",
        emoji: "🔥🔥🔥",
        bgColor: "bg-purple-500/20",
      };
    if (streakCount >= 15)
      return {
        color: "text-blue-500",
        emoji: "🔥🔥",
        bgColor: "bg-blue-500/20",
      };
    if (streakCount >= 7)
      return {
        color: "text-green-500",
        emoji: "🔥",
        bgColor: "bg-green-500/20",
      };
    if (streakCount >= 3)
      return {
        color: "text-yellow-500",
        emoji: "✨",
        bgColor: "bg-yellow-500/20",
      };
    return { color: "text-gray-400", emoji: "", bgColor: "bg-gray-700/20" };
  };

  const streakVisuals = getStreakVisuals(streak);

  if (loading) {
    return (
      <div className="bg-[#1a1a22] rounded-lg p-6 space-y-4 shadow-xl animate-pulse">
        {/* Loading State */}
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-24 bg-gray-700 rounded"></div>
        <div className="h-12 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a22] rounded-lg p-6 space-y-4 shadow-xl">
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a22] rounded-lg p-6 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Progress</h2>
        <div className="flex items-center gap-2">
          <FireIcon
            className={streakActive ? "text-orange-500" : "text-gray-400"}
          />
          <span
            className={`text-sm ${
              streakActive ? streakVisuals.color : "text-gray-400"
            }`}
          >
            {streak} Day Streak {streakVisuals.emoji}
          </span>
        </div>
      </div>

      {/* Streak Warning - Show if streak is at risk */}
      {!streakActive && streak > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-3 rounded-md text-sm">
          ⚠️ Your streak will reset if you don't earn XP today!
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Level Circle */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="bg-[#252530] rounded-lg p-4 flex flex-col items-center shadow-lg"
        >
          <div className="relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeWidth="10"
                stroke="#333"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeWidth="10"
                stroke="#8E24AA"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                animate={{ strokeDashoffset }}
                transition={{ duration: 1 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-purple-400">Level</span>
              <span className="text-2xl font-bold text-purple-400">
                {level}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {progress.toFixed(0)}% to Next Level
          </p>
        </motion.div>

        {/* Points Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#252530] rounded-lg p-4 flex flex-col items-center justify-center shadow-lg"
        >
          <StarIcon className="text-yellow-500 text-4xl mb-2 animate-pulse" />
          <h3 className="text-lg font-semibold text-purple-400">{points}</h3>
          <p className="text-xs text-gray-400">Points Earned</p>
        </motion.div>

        {/* Streak Card - Updated to show more streak info */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#252530] rounded-lg p-4 flex flex-col items-center justify-center shadow-lg"
        >
          <div className={`text-4xl mb-2 ${streakVisuals.color}`}>
            {streakVisuals.emoji || <FireIcon className="text-4xl" />}
          </div>
          <h3 className={`text-lg font-semibold ${streakVisuals.color}`}>
            {streak}/{highestStreak}
          </h3>
          <p className="text-xs text-gray-400">Current/Best Streak</p>
        </motion.div>
      </div>

      {/* Streak Progress (new) */}
      {nextMilestone && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Next milestone: {nextMilestone} days</span>
            <span>{daysToMilestone} days to go</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${streakVisuals.bgColor}`}
              style={{
                width: `${Math.min(
                  100,
                  (streak / (nextMilestone || 3)) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Activity Consistency (new) */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <TimelineIcon className="text-gray-500" />
        <span>Activity consistency: {streakPercentage}%</span>
      </div>

      {/* Claim XP Button with Countdown */}
      <motion.button
        onClick={handleClaimXP}
        whileTap={!xpClaimed ? { scale: 0.9 } : {}}
        disabled={xpClaimed}
        className={`w-full py-3 text-sm font-semibold rounded-md transition ${
          xpClaimed
            ? "bg-gray-600/50 text-gray-400 cursor-not-allowed opacity-75 border border-gray-700"
            : "bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20"
        }`}
      >
        {xpClaimed ? (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <ClockIcon className="text-gray-500 text-sm" />
              <span>XP Already Claimed Today</span>
            </div>
            {timeUntilNextClaim && (
              <span className="text-xs opacity-75 mt-1">
                Next claim in {timeUntilNextClaim}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>Claim Daily XP</span>
            {streak > 0 && (
              <span className="text-xs bg-purple-600/50 px-2 py-1 rounded-full">
                Continue {streak} day streak!
              </span>
            )}
          </div>
        )}
      </motion.button>
    </div>
  );
}
