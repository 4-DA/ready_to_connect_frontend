"use client";

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  const safeStreak = Math.max(0, streak); // Ensure non-negative

  return (
    <div className="bg-[#1a1a22] p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-2">🔥 Streak</h3>
      <p className="text-2xl text-purple-500">{safeStreak} Days</p>
    </div>
  );
}
