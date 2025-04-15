"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import GamificationOverlay from "@/components/GamificationOverlay";
import Calendar from "@/components/Calendar";
import ActivityFeed from "@/components/ActivityFeed";
import StatsCards from "@/components/StatsCard";
import AssignedStudents from "@/components/dashboards/mentor/AssignedStudents";
import { useTheme } from "@/app/providers/ThemeProvider";
import api from "@/utils/api";

export default function MentorDashboard() {
  const { user, loading } = useTheme();

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />
      <div className="flex-1 p-6 pl-20 relative z-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {user?.full_name || "Mentor"}
          </h1>
        </header>

        {/* <StatsCards /> */}
        <AssignedStudents />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <Calendar />
          <ActivityFeed />
        </div>
      </div>
      <GamificationOverlay />
    </div>
  );
}
