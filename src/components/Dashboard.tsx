'use client';

import Sidebar from './Sidebar';
import ActivityFeed from './ActivityFeed';
import StatsCards from './StatsCard';
import Calendar from './Calendar';
import ProgressSection from './ProgressSection';
import GamificationOverlay from './GamificationOverlay';
import { useState, useEffect } from 'react';

// Define the User interface to match the stored data structure
interface User {
  pk?: number;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null); // State to hold user data

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userDataJson = localStorage.getItem('user');
    if (userDataJson) {
      const parsedUserData = JSON.parse(userDataJson);
      setUser(parsedUserData);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 🔥 NEW: Refresh User Data from Backend
  const refreshUserData = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
    if (!token) {
      console.error("No token found.");
      return;
    }
  
    try {
      const response = await fetch("/api/gamification", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }
  
      const dashboardData = await response.json();
  
      // Safely update user
      setUser((prevUser) => {
        if (!prevUser) return null; // if no user yet
  
        const updatedUser: User = {
          ...prevUser, // keep all previous user fields (like pk, email, etc)
          xp: dashboardData.total_xp,
          streak: dashboardData.current_streak,
          level: dashboardData.current_level,
          // You can add badges here too if your dashboard API returns them
        };
  
        // Also update in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
  
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };
  

  // 👇 This makes refreshUserData callable from other parts (like DynamicQuiz)
  (globalThis as any).refreshUserData = refreshUserData;

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />
      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          {/* Search input field */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search dashboard..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-[#1e1e23] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                <p className="p-4 text-gray-400 text-sm">No results found</p>
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm font-medium">
                {user?.full_name || 'Guest'}
              </div>
              <p className="text-xs text-gray-400">
                {user?.user_type || 'User'}
              </p>
            </div>
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
