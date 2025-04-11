"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ActivityFeed from "./ActivityFeed";
import StatsCards from "./StatsCard";
import Calendar from "./Calendar";
import ProgressSection from "./ProgressSection";
import GamificationOverlay from "./GamificationOverlay";
import api from "@/utils/api"; // centralized Axios instance

// Match the structure returned by /accounts/auth/user/
interface User {
  id?: number;
  email: string;
  full_name: string;
  streak: number;
  xp: number;
  level: number;
  badge?: number;
  user_type: string;
  [key: string]: any;
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch logged-in user's info from /accounts/auth/user/
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/accounts/auth/user/");
        setUser(response.data);
        // Keep a local copy to avoid extra calls
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Handler for the search box (if you have searching logic)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Expose a "refreshUserData" function globally so other components can update
  // the user info (for example, after awarding XP or completing challenges).
  const refreshUserData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found; cannot refresh user data.");
      return;
    }

    try {
      // Pull updated XP, streak, etc., from /gamification/dashboard/
      const res = await api.get("/gamification/dashboard/");
      const dashData = res.data;

      // If we already have a user object in state, update it
      setUser((prev) => {
        if (!prev) return null;

        const updated = {
          ...prev,
          xp: dashData.total_xp,
          streak: dashData.current_streak,
          level: dashData.current_level,
        };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error refreshing user gamification data:", error);
    }
  };

  // Make it accessible to everything
  (globalThis as any).refreshUserData = refreshUserData;

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />

      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          {/* Search input */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search dashboard..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white
                focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-[#1e1e23] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                <p className="p-4 text-gray-400 text-sm">
                  No results found
                </p>
              </div>
            )}
          </div>

          {/* User Info (top-right) */}
          <div className="flex items-center gap-4">
            {loadingUser ? (
              <div className="text-gray-400 text-sm">Loading...</div>
            ) : user ? (
              <div className="text-right">
                <div className="text-sm font-medium">
                  {user.full_name || "User"} 
                </div>
                <p className="text-xs text-gray-400">
                  {user.user_type}
                </p>
              </div>
            ) : (
              <div className="text-right">
                <div className="text-sm font-medium">Guest</div>
                <p className="text-xs text-gray-400">User</p>
              </div>
            )}
          </div>
        </header>

        {/* For your stats cards */}
        <StatsCards />

        {/* Layout: progress, calendar, activity feed, etc. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {/* Shows XP, Streak, Claim XP button, etc. */}
          <ProgressSection />
          <div className="flex flex-col gap-6">
            <Calendar />
            <ActivityFeed />
          </div>
        </div>
      </div>

      <GamificationOverlay />
    </div>
  );
}
