"use client";

import { create } from "zustand";  // ✅ Only `zustand`, no `zustand/vanilla`!

interface Badge {
  id: number;        // ID from backend will likely be number not string
  name: string;
  imageUrl: string;
}

interface DailyChallenge {
  points: number;
  title: string;
  description: string;
  pointsAvailable: number;
}

interface GameState {
  level: number;
  points: number;
  streak: number;
  badges: Badge[];
  dailyChallenge: DailyChallenge;
  setGameData: (data: Partial<GameState>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  level: 1,
  points: 0,
  streak: 0,
  badges: [],
  dailyChallenge: {
    title: "Daily Coding Quiz",
    description: "Solve 5 coding problems.",
    pointsAvailable: 50,
    points: 0
  },
  setGameData: (data) => set((state) => ({ ...state, ...data })),
}));
