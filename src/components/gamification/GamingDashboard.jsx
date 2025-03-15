import React from "react";
import StreakCounter from "./ui/StreakCounter";
import ProgressBar from "./ui/ProgressBar";
import RewardStore from "./ui/RewardStore";
import DailyChallenge from "./ui/DailyChallenge";
import Leaderboard from "./ui/Leaderboard";
import { Link } from "react-router-dom";

export default function GamingDashboard() {
  console.log("GamingDashboard component rendering");

  return (
    <div className="p-6 space-y-4 border-2 border-red-500">
      <h1 className="text-2xl font-bold text-gray-800">
        🎮 Gamification Dashboard
      </h1>
      <p>Track your progress, complete daily challenges, and earn rewards!</p>

      {/* Add a simple test element */}
      <div className="bg-blue-500 p-4 text-white">
        This is a test element to see if the component renders
      </div>

      {/* Comment out the components one by one to find which might be causing issues */}
      <StreakCounter />
      <ProgressBar />
      <DailyChallenge />
      <RewardStore />
      <Leaderboard />

      {/* Button to Return to Main Dashboard */}
      <Link to="/dashboard">
        <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg mt-4">
          ⬅️ Back to Main Dashboard
        </button>
      </Link>
    </div>
  );
}
