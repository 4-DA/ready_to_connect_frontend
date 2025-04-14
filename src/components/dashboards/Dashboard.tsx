"use client";
import Sidebar from "../Sidebar";
import ActivityFeed from "../ActivityFeed";
import StatsCards from "../StatsCard";
import Calendar from "../Calendar";
import ProgressSection from "../ProgressSection";
import GamificationOverlay from "../GamificationOverlay";
import { useState, useEffect, createContext, useContext } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

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

// Create a theme context to share styling across components
interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glassPrimary: string;
  glassSecondary: string;
  glassBorder: string;
  gradientOverlay: string;
  user: User | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: "indigo",
  secondaryColor: "purple",
  accentColor: "indigo-400",
  glassPrimary: "bg-white/10 backdrop-blur-md",
  glassSecondary: "bg-white/5 backdrop-blur-sm",
  glassBorder: "border border-white/20",
  gradientOverlay: "bg-gradient-to-br from-indigo-600/20 to-purple-600/20",
  user: null,
  loading: false,
  refreshUserData: async () => {},
});

// Helper function to determine theme based on user properties
const getUserTheme = (user: User | null) => {
  if (!user) {
    return {
      primaryColor: "indigo",
      secondaryColor: "purple",
      accentColor: "indigo-400",
      glassPrimary: "bg-white/10 backdrop-blur-md",
      glassSecondary: "bg-white/5 backdrop-blur-sm",
      glassBorder: "border border-white/20",
      gradientOverlay: "bg-gradient-to-br from-indigo-600/20 to-purple-600/20",
    };
  }

  switch (user.user_type.toLowerCase()) {
    case "admin":
      return {
        primaryColor: "emerald",
        secondaryColor: "teal",
        accentColor: "emerald-400",
        glassPrimary: "bg-white/10 backdrop-blur-md",
        glassSecondary: "bg-white/5 backdrop-blur-sm",
        glassBorder: "border border-white/20",
        gradientOverlay: "bg-gradient-to-br from-emerald-600/20 to-teal-600/20",
      };
    case "mentor":
      return {
        primaryColor: "sage",
        secondaryColor: "terracotta",
        accentColor: "sage-400",
        glassPrimary: "bg-white/10 backdrop-blur-md",
        glassSecondary: "bg-white/5 backdrop-blur-sm",
        glassBorder: "border border-white/20",
        gradientOverlay:
          "bg-gradient-to-br from-sage-600/20 to-terracotta-600/20",
      };
    case "premium":
      return {
        primaryColor: "amber",
        secondaryColor: "orange",
        accentColor: "amber-400",
        glassPrimary: "bg-white/10 backdrop-blur-md",
        glassSecondary: "bg-white/5 backdrop-blur-sm",
        glassBorder: "border border-white/20",
        gradientOverlay: "bg-gradient-to-br from-amber-600/20 to-orange-600/20",
      };
    default:
      return {
        primaryColor: "indigo",
        secondaryColor: "purple",
        accentColor: "indigo-400",
        glassPrimary: "bg-white/10 backdrop-blur-md",
        glassSecondary: "bg-white/5 backdrop-blur-sm",
        glassBorder: "border border-white/20",
        gradientOverlay:
          "bg-gradient-to-br from-indigo-600/20 to-purple-600/20",
      };
  }
};

export function useTheme() {
  return useContext(ThemeContext);
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [theme, setTheme] = useState(getUserTheme(null));
  const router = useRouter();

  // Fetch latest user from backend and redirect if needed
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error(
          "Dashboard - No access token found in localStorage. Cannot fetch user data."
        );
        setLoadingUser(false);
        return;
      }

      try {
        console.log(
          "Dashboard - Fetching user data from /accounts/auth/user/ with token:",
          token
        );
        const response = await api.get("/accounts/auth/user/");
        console.log(
          "Dashboard - User data fetched successfully:",
          response.data
        );

        const userData = response.data;
        setUser(userData);
        setTheme(getUserTheme(userData));
        localStorage.setItem("user", JSON.stringify(userData));

        // Check user type for redirect
        checkUserTypeAndRedirect(userData);
      } catch (error) {
        console.error("Dashboard - Error fetching user data:", error);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log(
            "Dashboard - Using stored user data as fallback:",
            userData
          );
          setUser(userData);
          setTheme(getUserTheme(userData));

          // Check user type for redirect using stored data
          checkUserTypeAndRedirect(userData);
        } else {
          console.error(
            "Dashboard - No stored user data available. User fetch failed."
          );
        }
      } finally {
        setLoadingUser(false);
      }
    };

    const checkUserTypeAndRedirect = (userData: User) => {
      if (!userData || !userData.user_type) return;

      const userType = userData.user_type.toLowerCase().trim();
      const currentPath = window.location.pathname;

      // Only redirect if we're on the main dashboard path
      if (currentPath === "/dashboard") {
        console.log("Dashboard - Checking user type for redirect:", userType);

        if (userType === "mentor" || userType === "teacher") {
          console.log("Dashboard - Redirecting to mentor dashboard");
          router.push("/dashboard/mentor");
        } else if (userType === "student") {
          console.log("Dashboard - Redirecting to student dashboard");
          router.push("/dashboard/student");
        }
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Dashboard - Using initial stored user data:", userData);
      setUser(userData);
      setTheme(getUserTheme(userData));
      setLoadingUser(false);

      // Check user type for redirect using stored data
      checkUserTypeAndRedirect(userData);
    } else {
      fetchUser();
    }
  }, [router]);

  // Refresh User Gamification Data
  const refreshUserData = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      console.error(
        "Dashboard - No token found for gamification data refresh."
      );
      return;
    }
    try {
      console.log("Dashboard - Fetching gamification data...");
      const response = await api.get("/gamification/dashboard/");
      const dashboardData = response.data;
      setUser((prevUser) => {
        if (!prevUser) return null;
        const updatedUser: User = {
          ...prevUser,
          xp: dashboardData.total_xp,
          streak: dashboardData.current_streak,
          level: dashboardData.current_level,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error("Dashboard - Error refreshing gamification data:", error);
    }
  };

  // Make it globally accessible
  (globalThis as any).refreshUserData = refreshUserData;

  // User profile component with glassmorphism
  const UserProfile = () => {
    if (loadingUser) {
      return (
        <div
          className={`${theme.glassPrimary} ${theme.glassBorder} rounded-xl p-3 animate-pulse w-36 h-12`}
        ></div>
      );
    }

    if (user) {
      return (
        <div
          className={`${theme.glassPrimary} ${theme.glassBorder} rounded-xl p-3 relative overflow-hidden shadow-lg`}
        >
          <div
            className={`absolute top-0 left-0 w-full h-full ${theme.gradientOverlay} z-0`}
          ></div>
          <div className="z-10 relative">
            <div className="text-sm font-medium">{user.full_name}</div>
            <p className={`text-xs text-${theme.primaryColor}-200`}>
              {user.user_type}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${theme.glassPrimary} ${theme.glassBorder} rounded-xl p-3 relative overflow-hidden shadow-lg`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full ${theme.gradientOverlay} z-0`}
        ></div>
        <div className="z-10 relative">
          <div className="text-sm font-medium">Guest</div>
          <p className={`text-xs text-${theme.primaryColor}-200`}>User</p>
        </div>
      </div>
    );
  };

  return (
    <ThemeContext.Provider
      value={{ ...theme, user, loading: loadingUser, refreshUserData }}
    >
      <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div
            className={`absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-${theme.primaryColor}-600/20 blur-3xl`}
          ></div>
          <div
            className={`absolute bottom-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-${theme.secondaryColor}-600/15 blur-3xl`}
          ></div>
        </div>

        <Sidebar />
        <div className="flex-1 p-6 pl-20 relative z-10">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">General Dashboard</h1>
            <div className="flex items-center gap-4">
              <UserProfile />
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
    </ThemeContext.Provider>
  );
}
