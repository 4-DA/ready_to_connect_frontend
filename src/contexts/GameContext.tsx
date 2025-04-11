// src/contexts/GameContext.ts
import { create } from "zustand";
import api from "@/utils/api"; // Centralized Axios

interface GameState {
  level: number;
  points: number;
  streak: number;
  badges: any[];
  dailyChallenges: any[];
  loading: boolean;
  error: string | null;

  setGameData: (data: Partial<GameState>) => void;
  fetchGameData: (token: string) => Promise<void>; // ✨ Accept token
  fetchDailyChallenges: (token: string) => Promise<void>; // ✨ Accept token
  completeChallenge: (challengeId: number, token: string) => Promise<void>; // ✨ Accept token
}

export const useGameStore = create<GameState>((set, get) => ({
  level: 1,
  points: 0,
  streak: 0,
  badges: [],
  dailyChallenges: [],
  loading: false,
  error: null,

  setGameData: (data) => set((state) => ({ ...state, ...data })),

  fetchGameData: async (token: string) => {
    if (!token) {
      set({ error: "No authentication token found", loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      const response = await api.get("/gamification/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { current_level, total_xp, current_streak } = response.data;
      set({
        level: current_level,
        points: total_xp,
        streak: current_streak,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to load game data", loading: false });
      console.error("Error fetching game data:", error);
    }
  },

  fetchDailyChallenges: async (token: string) => {
    if (!token) {
      set({ error: "No authentication token found", loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      const response = await api.get("/gamification/daily-challenges/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ dailyChallenges: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to load daily challenges", loading: false });
      console.error("Error fetching daily challenges:", error);
    }
  },

  completeChallenge: async (challengeId: number, token: string) => {
    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    const { dailyChallenges, points } = get();
    const challenge = dailyChallenges.find((c) => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    set({ loading: true, error: null });
    try {
      const response = await api.post(
        "/gamification/quiz-progress/",
        { xp: challenge.pointsAvailable, streak: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newPoints = points + challenge.pointsAvailable;
      const newLevel = Math.floor(newPoints / 100) + 1;

      set({
        points: newPoints,
        level: newLevel,
        dailyChallenges: dailyChallenges.map((c) =>
          c.id === challengeId ? { ...c, completed: true } : c
        ),
        loading: false,
      });

    } catch (error) {
      set({ error: "Failed to complete challenge", loading: false });
      console.error("Error completing challenge:", error);
    }
  },
}));
