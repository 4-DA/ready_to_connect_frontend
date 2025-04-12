"use client";

import Sidebar from "./Sidebar";
import ActivityFeed from "./ActivityFeed";
import StatsCards from "./StatsCard";
import Calendar from "./Calendar";
import ProgressSection from "./ProgressSection";
import GamificationOverlay from "./GamificationOverlay";
import { useState, useEffect } from "react";
import api from "@/utils/api"; // ✅ centralized Axios instance

// Define the User interface to match the stored user structure
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
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch latest user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/accounts/auth/user/"); // ✅ real user endpoint
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data)); // 🛡️ update local storage
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // 🔥 NEW: Refresh User Gamification Data
  const refreshUserData = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (!token) {
      console.error("No token found.");
      return;
    }

    try {
      const response = await api.get("/gamification/dashboard/");
      const dashboardData = response.data;

      setUser((prevUser) => {
        if (!prevUser) return null; // no user yet

        const updatedUser: User = {
          ...prevUser,
          xp: dashboardData.total_xp,
          streak: dashboardData.current_streak,
          level: dashboardData.current_level,
        };

        // Also update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error("Error refreshing user gamification data:", error);
    }
  };

  // Make it globally accessible
  (globalThis as any).refreshUserData = refreshUserData;

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />

      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-end items-center mb-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            {loadingUser ? (
              <div className="text-gray-400 text-sm">Loading...</div>
            ) : user ? (
              <div className="text-right">
                <div className="text-sm font-medium">{user.full_name}</div>
                <p className="text-xs text-gray-400">{user.user_type}</p>
              </div>
            ) : (
              <div className="text-right">
                <div className="text-sm font-medium">Guest</div>
                <p className="text-xs text-gray-400">User</p>
              </div>
            )}
          </div>
        </header>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
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