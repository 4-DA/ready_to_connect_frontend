"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  StarBorder as StarIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
} from "@mui/icons-material";

export default function ProgressSection() {
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(0);
  const [xpClaimed, setXpClaimed] = useState(false);
  const [mentorshipSessions, setMentorshipSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          setError("Authentication required");
          setLoading(false);
          return;
        }

        // Use the students endpoint instead of login
        const studentsUrl =
          "https://readytoconnect.panemtech.com/api/profile/students/";

        try {
          const response = await axios.get(studentsUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const studentsData = response.data;
          let userData;

          if (Array.isArray(studentsData.results)) {
            // If it's paginated, look in results
            userData = studentsData.results[0]; // Assuming the first one is the current user
          } else if (Array.isArray(studentsData)) {
            // If it's a direct array
            userData = studentsData[0];
          } else {
            // If it's a single object
            userData = studentsData;
          }

          // Update state with fetched data
          setStreak(userData.streak || 5);
          setPoints(userData.points || 1250);
          setLevel(userData.level || 3);
          setProgress(userData.level_progress || 65);
          setMentorshipSessions(userData.mentorship_sessions || 2);
        } catch (apiError) {
          console.warn("API error, using default values:", apiError);
          // Set default values if the API call fails
          setStreak(5);
          setPoints(1250);
          setLevel(3);
          setProgress(65);
          setMentorshipSessions(2);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Check if XP was already claimed for today
  useEffect(() => {
    const lastClaimDate = localStorage.getItem("xpClaimDate");
    const today = new Date().toDateString();

    if (lastClaimDate === today) {
      setXpClaimed(true);
    }
  }, []);

  const handleClaimXP = async () => {
    if (!xpClaimed) {
      try {
        // Update local state
        setProgress((prev) => Math.min(prev + 10, 100));
        setPoints((prev) => prev + 10);
        setXpClaimed(true);
        localStorage.setItem("xpClaimDate", new Date().toDateString());
      } catch (error) {
        console.error("Error claiming XP:", error);
        setError("Failed to claim XP");
      }
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
          <h3 className="text-lg font-semibold text-purple-400">
            {mentorshipSessions}
          </h3>
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
