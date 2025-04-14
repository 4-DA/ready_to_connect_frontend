// src/contexts/GameContext.ts
import { create } from "zustand";
import api from "@/utils/api"; // Centralized Axios

interface Badge {
  id: number;
  name: string;
  icon: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  pointsAvailable: number;
  icon: string;
  completed?: boolean;
}

interface GameState {
  level: number;
  points: number;
  streak: number;
  badges: Badge[];
  dailyChallenges: Challenge[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  setGameData: (
    data: Partial<
      Omit<
        GameState,
        | "setGameData"
        | "fetchGameData"
        | "fetchDailyChallenges"
        | "completeChallenge"
        | "clearGameData"
      >
    >
  ) => void;
  fetchGameData: (token: string) => Promise<void>; // ✨ Accept token
  fetchDailyChallenges: (token: string) => Promise<void>; // ✨ Accept token
  completeChallenge: (challengeId: number, token: string) => Promise<void>; // ✨ Accept token
  clearGameData: () => void; // New function to clear data on logout
}

export const useGameStore = create<GameState>((set, get) => ({
  level: 1,
  points: 0,
  streak: 0,
  badges: [],
  dailyChallenges: [],
  loading: false,
  error: null,
  lastUpdated: null,

  setGameData: (data) => {
    set((state) => ({
      ...state,
      ...data,
      lastUpdated: new Date().toISOString(),
    }));
    console.log("GameStore - Updated game data:", data);

    // Dispatch an event that other components can listen for
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("game-data-updated"));
    }
  },

  fetchGameData: async (token: string) => {
    if (!token) {
      set({ error: "No authentication token found", loading: false });
      console.warn("GameStore - No token provided for fetchGameData");
      return;
    }

    set({ loading: true, error: null });
    console.log("GameStore - Fetching game data");

    try {
      // Ensure the Authorization header is set
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.get("/gamification/dashboard/");
      const { current_level, total_xp, current_streak, unlocked_badges } =
        response.data;

      console.log("GameStore - Received game data:", response.data);

      set({
        level: current_level || 1,
        points: total_xp || 0,
        streak: current_streak || 0,
        badges: unlocked_badges || [],
        loading: false,
        lastUpdated: new Date().toISOString(),
      });

      // Dispatch an event that other components can listen for
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("game-data-updated"));
      }
    } catch (error) {
      set({ error: "Failed to load game data", loading: false });
      console.error("GameStore - Error fetching game data:", error);
    }
  },

  fetchDailyChallenges: async (token: string) => {
    if (!token) {
      set({ error: "No authentication token found", loading: false });
      console.warn("GameStore - No token provided for fetchDailyChallenges");
      return;
    }

    set({ loading: true, error: null });
    console.log("GameStore - Fetching daily challenges");

    try {
      // Ensure the Authorization header is set
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.get("/gamification/daily-challenges/");
      console.log("GameStore - Received daily challenges:", response.data);

      set({
        dailyChallenges: response.data,
        loading: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      set({ error: "Failed to load daily challenges", loading: false });
      console.error("GameStore - Error fetching daily challenges:", error);
    }
  },

  completeChallenge: async (challengeId: number, token: string) => {
    if (!token) {
      set({ error: "No authentication token found" });
      console.warn("GameStore - No token provided for completeChallenge");
      return;
    }

    const { dailyChallenges, points } = get();
    const challenge = dailyChallenges.find((c) => c.id === challengeId);

    if (!challenge || challenge.completed) {
      console.warn("GameStore - Challenge not found or already completed");
      return;
    }

    set({ loading: true, error: null });
    console.log(`GameStore - Completing challenge ${challengeId}`);

    try {
      // Ensure the Authorization header is set
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.post("/gamification/quiz-progress/", {
        xp: challenge.pointsAvailable,
        streak: 1,
      });

      console.log("GameStore - Challenge completion response:", response.data);

      const newPoints = points + challenge.pointsAvailable;
      const newLevel = Math.floor(newPoints / 100) + 1;

      set({
        points: newPoints,
        level: newLevel,
        dailyChallenges: dailyChallenges.map((c) =>
          c.id === challengeId ? { ...c, completed: true } : c
        ),
        loading: false,
        lastUpdated: new Date().toISOString(),
      });

      // Dispatch an event that other components can listen for
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("game-data-updated"));
      }
    } catch (error) {
      set({ error: "Failed to complete challenge", loading: false });
      console.error("GameStore - Error completing challenge:", error);
    }
  },

  clearGameData: () => {
    set({
      level: 1,
      points: 0,
      streak: 0,
      badges: [],
      dailyChallenges: [],
      error: null,
      lastUpdated: new Date().toISOString(),
    });
    console.log("GameStore - Cleared game data");
  },
}));

// Set up auth change listener to automatically refresh game data
if (typeof window !== "undefined") {
  window.addEventListener("auth-state-changed", () => {
    const token = localStorage.getItem("access_token");
    console.log("GameStore - Auth state changed, token exists:", !!token);

    if (token) {
      console.log("GameStore - Auth state changed, refreshing game data");
      useGameStore.getState().fetchGameData(token);
      useGameStore.getState().fetchDailyChallenges(token);
    } else {
      console.log("GameStore - Auth state changed, clearing game data");
      useGameStore.getState().clearGameData();
    }
  });

  // Optional: Listen for a global refreshUserData call
  window.addEventListener("refreshUserData", () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      console.log("GameStore - refreshUserData event triggered");
      useGameStore.getState().fetchGameData(token);
    }
  });
}

// Debug helper - expose store to window for debugging
if (typeof window !== "undefined") {
  (window as any).__gameStore = useGameStore;
}
