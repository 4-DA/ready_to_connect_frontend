"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  StarBorder as StarIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
} from "@mui/icons-material";

export default function ProgressSection() {
  const [progress, setProgress] = useState(60);
  const [streak, setStreak] = useState(5);
  const [points, setPoints] = useState(1250);
  const [level, setLevel] = useState(3);
  const [xpClaimed, setXpClaimed] = useState(false);

  // Check if XP was already claimed for today
  useEffect(() => {
    const lastClaimDate = localStorage.getItem("xpClaimDate");
    const today = new Date().toDateString();

    if (lastClaimDate === today) {
      setXpClaimed(true);
    }
  }, []);

  const handleClaimXP = () => {
    if (!xpClaimed) {
      setProgress((prev) => Math.min(prev + 10, 100));
      setPoints((prev) => prev + 10);
      setXpClaimed(true);
      localStorage.setItem("xpClaimDate", new Date().toDateString());
    }
  };

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setProgress(0);
        setLevel((prev) => prev + 1);
      }, 1000);
    }
  }, [progress]);

  // Circular progress calculation
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-[#1a1a22] rounded-lg p-6 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Progress</h2>
        <div className="flex items-center gap-2">
          <FireIcon className="text-orange-500" />
          <span className="text-sm text-gray-300">{streak} Day Streak</span>
        </div>
      </div>

      {/* Progress Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Level Progress */}
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
            {progress}% to Next Level
          </p>
        </motion.div>

        {/* Points Earned */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#252530] rounded-lg p-4 flex flex-col items-center justify-center shadow-lg"
        >
          <StarIcon className="text-yellow-500 text-4xl mb-2 animate-pulse" />
          <h3 className="text-lg font-semibold text-purple-400">{points}</h3>
          <p className="text-xs text-gray-400">Points Earned</p>
        </motion.div>

        {/* Mentorship Sessions */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#252530] rounded-lg p-4 flex flex-col items-center justify-center shadow-lg"
        >
          <TrophyIcon className="text-purple-500 text-4xl mb-2" />
          <h3 className="text-lg font-semibold text-purple-400">2</h3>
          <p className="text-xs text-gray-400">Mentorship Sessions</p>
        </motion.div>
      </div>

      {/* XP Boost Button (Daily Limit) */}
      <motion.button
        onClick={handleClaimXP}
        whileTap={!xpClaimed ? { scale: 0.9 } : {}}
        disabled={xpClaimed}
        className={`w-full py-2 text-sm font-semibold rounded-md transition ${
          xpClaimed
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-purple-500 text-white hover:bg-purple-600"
        }`}
      >
        {xpClaimed ? "XP Already Claimed Today" : "Earn 10 XP"}
      </motion.button>
    </div>
  );
}
