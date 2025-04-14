// app/providers/ThemeProvider.tsx
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import api from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: number;
  email: string;
  user_type: "student" | "guardian" | "mentor" | "business" | "admin";
  xp: number;
  level: number;
  streak: number;
  full_name?: string;
  [key: string]: any;
}

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glassPrimary: string;
  glassSecondary: string;
  glassBorder: string;
  gradientOverlay: string;
  user: User | null;
  refreshUserData: () => Promise<void>;
  loading: boolean;
  // Added properties from Auth context
  authLoading: boolean;
  isAuthenticated: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    glassPrimary: string;
    glassSecondary: string;
    glassBorder: string;
    gradientOverlay: string;
  };
}

const defaultTheme = {
  primaryColor: "indigo",
  secondaryColor: "purple",
  accentColor: "indigo-400",
  glassPrimary: "bg-white/10 backdrop-blur-md",
  glassSecondary: "bg-white/5 backdrop-blur-sm", // Fixed typo "bg/white/5" -> "bg-white/5"
  glassBorder: "border border-white/20",
  gradientOverlay: "bg-gradient-to-br from-indigo-600/20 to-purple-600/20",
};

const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  user: null,
  refreshUserData: async () => {},
  loading: true,
  authLoading: true,
  isAuthenticated: false,
  theme: defaultTheme,
});

export function useTheme() {
  return useContext(ThemeContext);
}

const getUserTheme = (user: User | null) => {
  if (!user) {
    return {
      primaryColor: "indigo",
      secondaryColor: "purple",
      accentColor: "indigo-400",
      glassPrimary: "bg-white/10 backdrop-blur-md",
      glassSecondary: "bg-white/5 backdrop-blur-sm", // Fixed typo
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
        glassSecondary: "bg-white/5 backdrop-blur-sm", // Fixed typo
        glassBorder: "border border-white/20",
        gradientOverlay: "bg-gradient-to-br from-emerald-600/20 to-teal-600/20",
      };
    case "premium":
      return {
        primaryColor: "amber",
        secondaryColor: "orange",
        accentColor: "amber-400",
        glassPrimary: "bg-white/10 backdrop-blur-md",
        glassSecondary: "bg-white/5 backdrop-blur-sm", // Fixed typo
        glassBorder: "border border-white/20",
        gradientOverlay: "bg-gradient-to-br from-amber-600/20 to-orange-600/20",
      };
    default:
      return {
        primaryColor: "indigo",
        secondaryColor: "purple",
        accentColor: "indigo-400",
        glassPrimary: "bg-white/10 backdrop-blur-md",
        glassSecondary: "bg-white/5 backdrop-blur-sm", // Fixed typo
        glassBorder: "border border-white/20",
        gradientOverlay:
          "bg-gradient-to-br from-indigo-600/20 to-purple-600/20",
      };
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use the auth context to get user and authentication state
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(getUserTheme(null));

  useEffect(() => {
    console.log("ThemeProvider - Effect running", {
      authUser,
      isAuthenticated,
    });

    if (authUser && isAuthenticated) {
      console.log("ThemeProvider - Setting theme for authenticated user");
      setTheme(getUserTheme(authUser));
      setLoading(false);
    } else if (!authLoading) {
      console.log(
        "ThemeProvider - Auth loading is done but user not found, setting default theme"
      );
      setTheme(getUserTheme(null));
      setLoading(false);
    }
  }, [authUser, isAuthenticated, authLoading]);

  // Preserve your original refreshUserData implementation
  // But extract the login function outside of it to avoid the React Hooks error
  const { login } = useAuth();

  const refreshUserData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("ThemeProvider - No token found for refresh.");
      return;
    }
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/gamification/dashboard/");
      const dashboardData = response.data;

      if (authUser) {
        const updatedUser: User = {
          ...authUser,
          xp: dashboardData.total_xp,
          level: dashboardData.current_level,
          streak: dashboardData.current_streak,
        };

        // Use the login function that was obtained from useAuth() in the component scope
        if (login) {
          login(authUser.email, ""); // Re-authenticate to update user
        }
      }
    } catch (error) {
      console.error(
        "ThemeProvider - Error refreshing user gamification data:",
        error
      );
    }
  };

  // Create a combined value with both theme properties and auth properties
  const contextValue = {
    ...theme,
    user: authUser,
    refreshUserData,
    loading,
    authLoading,
    isAuthenticated,
    theme, // Include the theme object itself for components that expect it
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
