"use client";

interface DailyChallengeProps {
  challenge?: {
    title: string;
    description: string;
    points_available: number;
  } | null;
}

export default function DailyChallenge({ challenge }: DailyChallengeProps) {
  if (!challenge) {
    return (
      <div className="bg-[#1a1a22] p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-bold mb-2">No Challenge Today!</h3>
        <p className="text-sm text-gray-400">Check back tomorrow for a new mission 🚀</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a22] p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
      <p className="text-sm text-gray-300 mb-4">{challenge.description}</p>
      <p className="text-purple-400 font-semibold">
        🏆 {challenge.points_available} XP available
      </p>
    </div>
  );
}
