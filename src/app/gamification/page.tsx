"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/contexts/GameContext";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import DailyChallenge from "./DailyChallenge";
import ProgressBar from "./progress";
import StreakCounter from "./streak";

export default function GamificationDashboard() {
  const { level, points, streak, badges, dailyChallenge, setGameData } = useGameStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchGamificationData() {
      try {
        const response = await api.get("/gamification/dashboard/");
        const data = response.data;

        setGameData({
          level: data.current_level,
          points: data.total_xp,
          streak: data.current_streak,
          badges: (data.badges || []).map((badgeObj: any) => ({
            id: badgeObj.badge.id,
            name: badgeObj.badge.name,
            imageUrl: badgeObj.badge.icon || "",
          })),
          dailyChallenge: data.daily_challenge || null,
        });

      } catch (error) {
        console.error("Error fetching gamification dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGamificationData();
  }, [setGameData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0e0e13] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        <p className="ml-4">Loading your career quest...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <button
          className="mb-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-800 transition"
          onClick={() => router.push("/dashboard")}
        >
          ⬅ Back to Main Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6">🎮 Career Quest</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <StreakCounter streak={streak ?? 0} />
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ProgressBar progress={points ? (points % 500) / 5 : 0} />
          </motion.div>

          {
  dailyChallenge && (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <DailyChallenge
        challenge={{
          title: dailyChallenge.title || "Daily Challenge",
          description: dailyChallenge.description || "Complete today's mission!",
          points_available: dailyChallenge.pointsAvailable || dailyChallenge.points || 10, // fallback
        }}
      />
    </motion.div>
  )
}

        </div>
      </div>
    </div>
  );
}
