"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import api from "@/utils/api";

interface User {
  id: number;
  email: string;
  user_type: "student" | "guardian" | "mentor" | "business";
  xp: number;
  level: number;
  streak: number;
  full_name?: string;
  [key: string]: any;
}

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

  const emitAuthStateChanged = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-state-changed"));
    }
  };

  const mapUserData = async (data: any): Promise<User> => {
    const userData: User = {
      id: data.id || 0,
      email: data.email || "",
      user_type:
        data.user_type?.trim() !== ""
          ? data.user_type
          : data.role?.trim() !== ""
          ? data.role
          : "student",
      xp: data.total_xp || 0,
      level: data.current_level || 1,
      streak: data.current_streak || 0,
      full_name: data.full_name || "",
    };

    try {
      const gamificationResponse = await api.get("/gamification/dashboard/");
      console.log(
        "AuthProvider - Fetched gamification data:",
        gamificationResponse.data
      );
      userData.xp = gamificationResponse.data.total_xp || 0;
      userData.level = gamificationResponse.data.current_level || 1;
      userData.streak = gamificationResponse.data.current_streak || 0;
    } catch (error) {
      console.error("AuthProvider - Error fetching gamification data:", error);
    }

    return userData;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem("access_token");
      console.log("AuthProvider - Initializing with token:", storedToken);

      if (storedToken) {
        try {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          const response = await api.get("/accounts/auth/user/");
          console.log("AuthProvider - Fetched user on mount:", response.data);
          const userData = await mapUserData(response.data);
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);
          emitAuthStateChanged();
        } catch (error) {
          console.error(
            "AuthProvider - Token validation failed on mount:",
            error
          );
          logout();
        }
      } else {
        console.log("AuthProvider - No token found on mount");
      }

      // 👇 THIS LINE ENSURES authLoading becomes false
      setIsLoading(false);
      console.log(
        "AuthProvider - Finished initializeAuth (auth loading now false)"
      );
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      if (typeof window === "undefined") return;

      setIsLoading(true);
      try {
        const response = await api.post("/accounts/auth/login/", {
          email,
          password,
        });
        const { access_token, refresh_token, user: userData } = response.data;

        console.log("AuthProvider - Login response:", response.data);

        const mappedUser = await mapUserData(userData);

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        setToken(access_token);
        setUser(mappedUser);
        setIsAuthenticated(true);

        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        emitAuthStateChanged();

        toast.success("Logged in successfully!");
        router.push("/dashboard");
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.detail ||
          "Login failed. Please check your credentials.";
        toast.error(errorMsg);
        console.error("AuthProvider - Login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;

    console.log("AuthProvider - Logging out");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];
    emitAuthStateChanged();

    toast.success("Logged out successfully!");
    router.push("/signin");
  }, [router]);

  const refreshToken = useCallback(async () => {
    if (typeof window === "undefined") return;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      console.log("AuthProvider - No refresh token found");
      logout();
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/accounts/auth/token/refresh/", {
        refresh: refreshToken,
      });

      const { access_token } = response.data;
      console.log("AuthProvider - Token refreshed:", access_token);
      localStorage.setItem("access_token", access_token);
      setToken(access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setIsAuthenticated(true);

      const userResponse = await api.get("/accounts/auth/user/");
      console.log("AuthProvider - Refreshed user data:", userResponse.data);
      const userData = await mapUserData(userResponse.data);
      setUser(userData);
      emitAuthStateChanged();
    } catch (error) {
      console.error("AuthProvider - Token refresh failed:", error);
      logout();
      toast.error("Session expired. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        await api.get("/accounts/auth/user/");
        console.log("AuthProvider - Token still valid");
      } catch (error) {
        console.log("AuthProvider - Token invalid, attempting refresh");
        await refreshToken();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [token, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
