"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  StarBorder as StarIcon, 
  EmojiEvents as TrophyIcon, 
  LocalFireDepartment as FireIcon 
} from "@mui/icons-material";
import api from "@/utils/api";  // Your custom Axios

export default function ProgressSection() {
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [xpClaimed, setXpClaimed] = useState(false);
  const [mentorshipSessions, setMentorshipSessions] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, fetch the latest data from /gamification/dashboard/
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // We expect the backend to return { current_streak, total_xp, current_level, ... }
      const response = await api.get("/gamification/dashboard/");
      const data = response.data;

      setStreak(data.current_streak || 0);
      setPoints(data.total_xp || 0);
      setLevel(data.current_level || 1);

      // Suppose each level is 100 XP for this example
      // 'progress' is the percent of XP toward the *next* level
      const xpInCurrentLevel = data.total_xp % 100;
      const percentToNext = (xpInCurrentLevel / 100) * 100; 
      setProgress(percentToNext);

      // If your backend tracks "mentorship_sessions"
      setMentorshipSessions(data.mentorship_sessions || 0);

    } catch (err) {
      console.error("API error, using default values:", err);
      setError("Failed to load user data from /gamification/dashboard/.");
    } finally {
      setLoading(false);
    }
  };

  // Check localStorage to see if user already claimed daily XP today
  useEffect(() => {
    const lastClaimDate = localStorage.getItem("xpClaimDate");
    const today = new Date().toDateString();
    if (lastClaimDate === today) {
      setXpClaimed(true);
    }
  }, []);

  // Handle claiming daily XP
  const handleClaimXP = async () => {
    if (xpClaimed) return; 
    try {
      // Make POST call to your daily-XP endpoint
      const response = await api.post("/gamification/claim-xp/");
      const { xp_awarded } = response.data;

      toast.success(`🎉 +${xp_awarded} XP claimed!`);
      setXpClaimed(true);
      // Mark that we've claimed XP today
      localStorage.setItem("xpClaimDate", new Date().toDateString());

      // Optionally force a refresh of the user data 
      if (typeof (globalThis as any).refreshUserData === "function") {
        await (globalThis as any).refreshUserData();
      }
      // Re-fetch local data so progress updates
      await fetchUserData();

    } catch (error: any) {
      console.error("Error claiming XP:", error);

      // If the backend says "already claimed", handle that
      if (error.response?.data?.detail?.includes("already claimed")) {
        toast.error("🛑 You already claimed XP today!");
      } else {
        toast.error("❌ Failed to claim daily XP.");
      }
    }
  };

  // For the ring around the level
  const circumference = 2 * Math.PI * 45;
  const safeProgress = isNaN(progress) ? 0 : progress;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  if (loading) {
    return (
      <div className="bg-[#1a1a22] rounded-lg p-6 space-y-4 shadow-xl animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#252530] rounded-lg p-4 h-40"></div>
          <div className="bg-[#252530] rounded-lg p-4 h-40"></div>
          <div className="bg-[#252530] rounded-lg p-4 h-40"></div>
        </div>
        <div className="h-10 bg-gray-700 rounded"></div>
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
      {/* Header - Title + Streak */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Progress</h2>
        <div className="flex items-center gap-2">
          <FireIcon className="text-orange-500" />
          <span className="text-sm text-gray-300">
            {streak} Day Streak
          </span>
        </div>
      </div>

      {/* 3 Cards: Level circle, Points, Mentorship Sess. */}
      <div className="grid grid-cols-3 gap-4">
        {/* Circular Level Card */}
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
          <h3 className="text-lg font-semibold text-purple-400">
            {points}
          </h3>
          <p className="text-xs text-gray-400">Points Earned</p>
        </motion.div>

        {/* Mentorship Sessions Card (dummy) */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#252530] rounded-lg p-4 flex flex-col items-center justify-center shadow-lg"
        >
          <TrophyIcon className="text-purple-500 text-4xl mb-2" />
          <h3 className="text-lg font-semibold text-purple-400">
            {mentorshipSessions}
          </h3>
          <p className="text-xs text-gray-400">Mentorship Sessions</p>
        </motion.div>
      </div>

      {/* Claim XP Button */}
      <motion.button
        onClick={handleClaimXP}
        whileTap={!xpClaimed ? { scale: 0.9 } : {}}
        disabled={xpClaimed}
        className={`w-full py-2 text-sm font-semibold rounded-md transition
          ${
            xpClaimed
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
      >
        {xpClaimed ? "XP Already Claimed Today" : "Claim Daily XP"}
      </motion.button>
    </div>
  );
}
