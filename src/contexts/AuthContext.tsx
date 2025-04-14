"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/utils/api";

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

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  refreshToken: async () => {},
  refreshUser: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const emitAuthStateChanged = (reason = "") => {
    if (typeof window !== "undefined") {
      console.log(`🔔 Auth state changed (${reason}), emitting event`);
      window.dispatchEvent(new Event("auth-state-changed"));

      if (typeof window !== "undefined") {
        (window as any).lastAuthUpdate = new Date().toISOString();
        (window as any).lastAuthReason = reason;
      }
    }
  };

  const mapUserData = async (data: any): Promise<User> => {
    console.log("AuthProvider - Mapping user data:", data);

    // Enhanced email-to-role mapping
    const emailToRoleMap: { [key: string]: string } = {
      "basuquana@dreamclarify.org": "mentor",
      "dougy15@gmail.com": "student",
      // Add any other test emails you're using
    };

    // Extract user type with better fallback strategy
    let userType = "student"; // Default fallback

    // Check user_type field with case insensitivity
    if (
      data.user_type &&
      typeof data.user_type === "string" &&
      data.user_type.trim() !== ""
    ) {
      userType = data.user_type.toLowerCase().trim();
      console.log("AuthProvider - Using user_type from response:", userType);
    }
    // Check role field if user_type is not available
    else if (
      data.role &&
      typeof data.role === "string" &&
      data.role.trim() !== ""
    ) {
      userType = data.role.toLowerCase().trim();
      console.log("AuthProvider - Using role from response:", userType);
    }
    // Fall back to email map if needed
    else if (data.email && emailToRoleMap[data.email]) {
      userType = emailToRoleMap[data.email];
      console.log("AuthProvider - Using email-based role mapping:", userType);
    }

    // Fix any inconsistent naming
    if (userType === "teacher") {
      userType = "mentor";
      console.log("AuthProvider - Converting 'teacher' type to 'mentor'");
    }

    // Construct user object with determined type
    const userData: User = {
      id: data.id || 0,
      email: data.email || "",
      user_type: userType as any,
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

    console.log("AuthProvider - Final mapped user:", userData);

    // Store raw user data for debugging
    if (typeof window !== "undefined") {
      localStorage.setItem("debug_raw_user", JSON.stringify(data));
      localStorage.setItem("debug_mapped_user", JSON.stringify(userData));
    }

    return userData;
  };

  const refreshUser = useCallback(async () => {
    console.log("AuthProvider - Refreshing user data");
    try {
      const res = await api.get("/accounts/auth/user/");
      console.log("AuthProvider - Raw user data from API:", res.data);
      const userData = await mapUserData(res.data);
      setUser(userData);
      setIsAuthenticated(true);
      emitAuthStateChanged("user_refreshed");
      return userData;
    } catch (error) {
      console.error("AuthProvider - refreshUser failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem("access_token");
      console.log(
        "AuthProvider - Initializing with token:",
        storedToken ? "exists" : "none"
      );

      if (storedToken) {
        try {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          setToken(storedToken);

          const userData = await refreshUser();
          if (userData) {
            console.log(
              "AuthProvider - Successfully initialized with user:",
              userData.email,
              "user_type:",
              userData.user_type
            );
            emitAuthStateChanged("init_success");
          } else {
            console.log("AuthProvider - Token exists but user fetch failed");
            logout();
          }
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

      setIsLoading(false);
      console.log(
        "AuthProvider - Initialization complete, isLoading set to false"
      );
    };

    initializeAuth();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (typeof window === "undefined") return;

      setIsLoading(true);
      try {
        console.log("AuthProvider - Attempting login for:", email);

        const response = await api.post("/accounts/auth/login/", {
          email,
          password,
        });
        const { access_token, refresh_token, user: userData } = response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

        console.log("AuthProvider - Raw login response user data:", userData);
        const mappedUser = await mapUserData(userData);

        // For debugging - store the email in localStorage to help with testing
        localStorage.setItem("last_login_email", email);

        // Force user type based on email for testing if needed
        if (email === "basuquana@dreamclarify.org") {
          console.log(
            "AuthProvider - Force setting user type to mentor for test account"
          );
          mappedUser.user_type = "mentor";
        }

        setToken(access_token);
        setUser(mappedUser);
        setIsAuthenticated(true);

        console.log(
          "AuthProvider - Login successful, user type:",
          mappedUser.user_type,
          "emitting auth state change"
        );
        emitAuthStateChanged("login_success");

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
    // Don't remove debug values to help with troubleshooting
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];
    emitAuthStateChanged("logout");

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
      console.log("AuthProvider - Attempting to refresh token");
      const response = await api.post("/accounts/auth/token/refresh/", {
        refresh: refreshToken,
      });

      const { access_token } = response.data;
      console.log("AuthProvider - Token refreshed successfully");
      localStorage.setItem("access_token", access_token);
      setToken(access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setIsAuthenticated(true);

      await refreshUser();
      emitAuthStateChanged("token_refreshed");
    } catch (error) {
      console.error("AuthProvider - Token refresh failed:", error);
      logout();
      toast.error("Session expired. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  }, [logout, refreshUser]);

  useEffect(() => {
    if (!token) return;

    if (typeof window !== "undefined") {
      (window as any).refreshUserData = async () => {
        console.log("Global refreshUserData called");
        await refreshUser();
      };

      // Debugging helper function
      (window as any).debugAuthState = () => {
        console.log("Current Auth State:");
        console.log("- isAuthenticated:", isAuthenticated);
        console.log("- isLoading:", isLoading);
        console.log("- user:", user);
        console.log("- token exists:", !!token);
        console.log(
          "- localStorage token:",
          localStorage.getItem("access_token")
        );
        console.log("- localStorage user:", localStorage.getItem("user"));
        console.log(
          "- localStorage debug raw user:",
          localStorage.getItem("debug_raw_user")
        );
        console.log(
          "- localStorage debug mapped user:",
          localStorage.getItem("debug_mapped_user")
        );
        return {
          isAuthenticated,
          isLoading,
          user,
          hasToken: !!token,
        };
      };
    }

    const interval = setInterval(async () => {
      try {
        await api.get("/accounts/auth/user/");
        console.log("AuthProvider - Token still valid");
      } catch (error) {
        console.log("AuthProvider - Token invalid, attempting refresh");
        await refreshToken();
      }
    }, 300000);

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        delete (window as any).refreshUserData;
        delete (window as any).debugAuthState;
      }
    };
  }, [token, refreshToken, refreshUser, isAuthenticated, isLoading, user]);

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
        refreshUser,
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
