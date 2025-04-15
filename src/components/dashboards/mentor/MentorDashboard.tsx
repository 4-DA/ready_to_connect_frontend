"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCard";
import Calendar from "@/components/Calendar";
import ActivityFeed from "@/components/ActivityFeed";
import GamificationOverlay from "@/components/GamificationOverlay";
import api from "@/utils/api";

export default function MentorDashboard() {
  const [mentorName, setMentorName] = useState("Mentor");
  const [userType, setUserType] = useState("mentor");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/accounts/auth/user/");
        const data = res.data;
        setMentorName(data.full_name || "Mentor");
        setUserType(data.user_type || "mentor");
      } catch (err) {
        console.error("Failed to fetch mentor data", err);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />
      <div className="flex-1 p-6 pl-20 relative z-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome back, {mentorName}</h1>
          <div className="text-sm text-gray-400 capitalize">{userType}</div>
        </header>

        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <Calendar />
          </div>
          <ActivityFeed />
        </div>

        <GamificationOverlay />
      </div>
    </div>
  );
}
