// components/dashboards/MentorDashboard.tsx
"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import Sidebar from "@/components/Sidebar";
import ActivityFeed from "@/components/ActivityFeed";
import StatsCards from "@/components/StatsCard";
import Calendar from "@/components/Calendar";
import GamificationOverlay from "@/components/GamificationOverlay";

export default function MentorDashboard() {
  const {
    user,
    primaryColor,
    secondaryColor,
    glassPrimary,
    glassBorder,
    gradientOverlay,
  } = useTheme();

  const UserProfile = () => {
    if (!user) {
      return (
        <div
          className={`${glassPrimary} ${glassBorder} rounded-xl p-3 animate-pulse w-36 h-12`}
        ></div>
      );
    }

    return (
      <div
        className={`${glassPrimary} ${glassBorder} rounded-xl p-3 relative overflow-hidden shadow-lg`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full ${gradientOverlay} z-0`}
        ></div>
        <div className="z-10 relative">
          <div className="text-sm font-medium">
            {user.full_name || "Unknown Mentor"}
          </div>
          <p className={`text-xs text-${primaryColor}-200`}>Mentor</p>
        </div>
      </div>
    );
  };

  const MentorStats = () => {
    return (
      <div
        className={`${glassPrimary} ${glassBorder} rounded-xl p-6 relative overflow-hidden shadow-lg`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full ${gradientOverlay} z-0`}
        ></div>
        <div className="z-10 relative">
          <h2 className="text-lg font-semibold mb-4">Mentoring Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-blue-400 text-2xl">👥</span>
              <p className="text-lg">10</p>
              <p className="text-sm text-gray-400">Students Mentored</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-green-400 text-2xl">📈</span>
              <p className="text-lg">85%</p>
              <p className="text-sm text-gray-400">Average Student Progress</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-${primaryColor}-600/20 blur-3xl`}
        ></div>
        <div
          className={`absolute bottom-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-${secondaryColor}-600/15 blur-3xl`}
        ></div>
      </div>

      <Sidebar userType={user?.user_type?.toLowerCase() || "mentor"} />
      <div className="flex-1 p-6 pl-20 relative z-10">
        <header className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-4">
            <UserProfile />
          </div>
        </header>
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <MentorStats />
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
