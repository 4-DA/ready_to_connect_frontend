import { create } from "zustand";

type GameState = {
  level: number;
  points: number;
  streak: number;
  badges: { id: string; name: string; imageUrl: string }[];
  dailyChallenge: { title: string; description: string; pointsAvailable: number };
};

export const useGameStore = create<GameState>((set) => ({
  level: 1,
  points: 0,
  streak: 0,
  badges: [],
  dailyChallenge: { title: "Daily Coding Quiz", description: "Solve 5 coding problems.", pointsAvailable: 50 },
}));
