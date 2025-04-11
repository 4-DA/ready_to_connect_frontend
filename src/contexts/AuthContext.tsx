"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // For secure cookie management
import { toast } from "react-hot-toast"; // For user feedback
import api from "@/utils/api"; // Your centralized Axios instance

// Define the user type based on your backend response
interface User {
  id: number;
  email: string;
  user_type: "student" | "guardian" | "mentor" | "business";
}

// Define the full AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  refreshToken: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem("access_token"); // Fallback to localStorage for now
      if (storedToken) {
        try {
          // Validate token and fetch user data
          const response = await api.get("/accounts/auth/user/", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(response.data);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed:", error);
          logout(); // Clear invalid token
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function with email/password
  const login = useCallback(async (email: string, password: string) => {
    if (typeof window === "undefined") return;

    setIsLoading(true);
    try {
      const response = await api.post("/accounts/auth/login/", {
        email,
        password,
      });

      const { access_token, refresh_token, user: userData } = response.data;

      // Store tokens (use cookies for better security in production)
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token); // For token refresh
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);

      // Configure Axios with token
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      toast.success("Logged in successfully!");
      router.push(userData.user_type === "mentor" ? "/mentor-dashboard" : "/");
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Logout function
  const logout = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully!");
    router.push("/signin");
  }, [router]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    if (typeof window === "undefined") return;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      logout();
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/accounts/auth/token/refresh/", {
        refresh: refreshToken,
      });

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      setToken(access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setIsAuthenticated(true);

      // Refresh user data
      const userResponse = await api.get("/accounts/auth/user/");
      setUser(userResponse.data);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      toast.error("Session expired. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Periodically check token validity
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const checkToken = async () => {
        try {
          await api.get("/accounts/auth/user/");
        } catch (error) {
          refreshToken(); // Attempt to refresh if token is invalid
        }
      };
      checkToken();
    }, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [token, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, token, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}