"use client";
import { useGameStore } from "../../contexts/GameContext";
import { useRouter } from "next/navigation";
import StreakCounter from "./streak";
import ProgressBar from "./progress";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import DailyChallenge from "./DailyChallenge";
export default function GamificationDashboard() {
  const { level, points, streak, badges, dailyChallenge } = useGameStore();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-dark text-white">
      {/* ✅ Sidebar for Consistency */}
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* 🚀 Back to Dashboard Button */}
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
            <StreakCounter streak={streak} />
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ProgressBar progress={(points % 500) / 5} />
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <DailyChallenge challenge={dailyChallenge} />
          </motion.div>

          <motion.div 
            className="md:col-span-2 lg:col-span-3"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <BadgeGallery badges={badges} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
