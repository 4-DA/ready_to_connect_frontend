"use client";
import Sidebar from "@/components/Sidebar";
import ActivityFeed from "@/components/ActivityFeed";
import StatsCards from "@/components/StatsCard";
import Calendar from "@/components/Calendar";
import ProgressSection from "@/components/ProgressSection";
import GamificationOverlay from "@/components/GamificationOverlay";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function StudentDashboard() {
  const { user, theme } = useTheme();

  // Safely access user properties
  const fullName = user?.full_name || "Student";
  const userType = user?.user_type || "student";

  // User profile component with glassmorphism
  const UserProfile = () => {
    return (
      <div
        className={`${theme.glassPrimary} ${theme.glassBorder} rounded-xl p-3 relative overflow-hidden shadow-lg`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full ${theme.gradientOverlay} z-0`}
        ></div>
        <div className="z-10 relative">
          <div className="text-sm font-medium">{fullName}</div>
          <p className={`text-xs text-${theme.primaryColor}-200`}>{userType}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-${theme.primaryColor}-600/20 blur-3xl`}
        ></div>
        <div
          className={`absolute bottom-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-${theme.secondaryColor}-600/15 blur-3xl`}
        ></div>
      </div>

      <Sidebar userType="student" />
      <div className="flex-1 p-6 pl-20 relative z-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <UserProfile />
          </div>
        </header>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <ProgressSection title="Learning Progress" />
          <div className="flex flex-col gap-6">
            <Calendar title="My Schedule" />
            <ActivityFeed title="My Activity" />
          </div>
        </div>

        {/* Student-specific sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Upcoming Assignments */}
          <div
            className={`${theme.glassPrimary} ${theme.glassBorder} rounded-xl p-6 shadow-lg relative overflow-hidden`}
          >
            <div
              className={`absolute top-0 left-0 w-full h-full ${theme.gradientOverlay} z-0`}
            ></div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-4">
                Upcoming Assignments
              </h2>
              <div className="space-y-3">
                {[
                  {
                    title: "Math Quiz",
                    due: "Tomorrow, 3:00 PM",
                    progress: 75,
                  },
                  {
                    title: "Science Project",
                    due: "Friday, 11:59 PM",
                    progress: 30,
                  },
                  { title: "English Essay", due: "Next Monday", progress: 10 },
                ].map((assignment, index) => (
                  <div key={index} className="p-3 bg-white/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{assignment.title}</h3>
                      <span className="text-sm text-gray-300">
                        {assignment.due}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${theme.primaryColor}-500`}
                        style={{ width: `${assignment.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-right text-xs text-gray-400">
                      {assignment.progress}% complete
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div
            className={`${theme.glassPrimary} ${theme.glassBorder} rounded-xl p-6 shadow-lg relative overflow-hidden`}
          >
            <div
              className={`absolute top-0 left-0 w-full h-full ${theme.gradientOverlay} z-0`}
            ></div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "First Login", icon: "🌟", unlocked: true },
                  { name: "5-Day Streak", icon: "🔥", unlocked: true },
                  { name: "Perfect Quiz", icon: "💯", unlocked: true },
                  { name: "Team Player", icon: "👥", unlocked: false },
                  { name: "Early Bird", icon: "🌅", unlocked: false },
                  { name: "Night Owl", icon: "🦉", unlocked: false },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center ${
                      badge.unlocked
                        ? `bg-${theme.primaryColor}-600/30`
                        : "bg-white/5 opacity-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-sm font-medium truncate">
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GamificationOverlay />
    </div>
  );
}
