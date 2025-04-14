"use client";

import React, { useEffect, useState } from "react";
import {
  Star as PointsIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  EmojiEvents as LevelIcon,
} from "@mui/icons-material";
import api from "@/utils/api";

// Define TypeScript interface for our user stats.
interface UserStats {
  streak: number;
  xp: number;
  level: number;
  badge?: number;
}

// Default fallback stats.
const DEFAULT_STATS: UserStats = {
  streak: 0,
  xp: 0,
  level: 0,
};

// Production-ready StatsCards component.
const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats from API endpoint
  const fetchUserStats = async () => {
    try {
      setLoading(true);

      // Check for authentication token
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("Authentication token not found. Using demo data.");
        // Instead of failing, use demo data or display a login prompt
        setStats({
          streak: 5,
          xp: 1250,
          level: 3,
        });
        return;
      }

      // Make sure your API instance is properly configured
      // This ensures the token is included in the request
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Add a console log to see the full request details
      console.log("Making request to: ", "/gamification/dashboard");

      // Make the request to the backend
      const response = await api.get("/gamification/dashboard/"); // Note: added trailing slash

      console.log("API Response:", response);

      if (response.data) {
        setStats({
          streak: response.data.current_streak || 0,
          xp: response.data.total_xp || 0,
          level: response.data.current_level || 1,
          badge: response.data.badge,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Error fetching user stats:", err);

      // Show the specific error message from the API if available
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to load stats from the server. Please try again later.";

      setError(errorMessage);

      // Use localStorage data as fallback
      rehydrateStats();
    } finally {
      setLoading(false);
    }
  };

  // Function to load stats from localStorage
  const rehydrateStats = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setStats({
          streak: userData.streak || 0,
          xp: userData.xp || 0,
          level: userData.level || 1,
          badge: userData.badge,
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  };

  // Use effect to hydrate stats from local storage first (if available)
  // and then update with fresh data from the server.
  useEffect(() => {
    rehydrateStats();
    fetchUserStats();

    // Optional: Add refresh timer to periodically update stats
    const refreshInterval = setInterval(fetchUserStats, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval); // Cleanup on component unmount
  }, []);

  // Render a loading skeleton while data is being fetched.
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse h-24 shadow-lg"
          ></div>
        ))}
      </div>
    );
  }

  // Display an error message if fetching fails.
  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-5 text-red-300 text-sm shadow-lg">
        {error}
        <div className="mt-3">
          <button
            onClick={fetchUserStats}
            className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Create an array of card definitions based on user stats.
  // Using a modern glassmorphism style for all cards
  const cards = [
    {
      id: "streak",
      title: "Streak",
      value: `${stats.streak} Days`,
      icon: (
        <LocalFireDepartmentIcon className="text-indigo-400 text-4xl mb-2" />
      ),
      bgClass: "bg-white/10 backdrop-blur-md border border-white/20",
    },
    {
      id: "xp",
      title: "XP Points",
      value: stats.xp.toLocaleString(), // Ensures number is formatted properly.
      icon: <PointsIcon className="text-indigo-400 text-4xl mb-2" />,
      bgClass: "bg-white/10 backdrop-blur-md border border-white/20",
    },
    {
      id: "level",
      title: "Level",
      value: stats.level.toString(),
      icon: <LevelIcon className="text-indigo-400 text-4xl mb-2" />,
      bgClass: "bg-white/10 backdrop-blur-md border border-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          value={card.value}
          bgClass={card.bgClass}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

// Define a reusable stat card component.
interface StatCardProps {
  title: string;
  value: string;
  bgClass: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, bgClass, icon }) => {
  return (
    <div
      className={`${bgClass} rounded-xl p-6 text-white flex flex-col shadow-lg relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 z-0"></div>
      <div className="z-10 flex items-center gap-2 mb-2 text-sm font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <div className="z-10 text-3xl font-bold">{value}</div>
    </div>
  );
};

export default StatsCards;
