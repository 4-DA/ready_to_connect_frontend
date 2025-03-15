import React, { useEffect, useState } from "react";
import { Fire } from "lucide-react";
import { useGamification } from "../../../context/GamificationContext";

export default function StreakCounter() {
  const { streak, checkStreak } = useGamification();
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkStreak();
  }, []);

  useEffect(() => {
    if (streak > 0) {
      setMessage(`🔥 You're on a ${streak}-day streak!`);
    } else {
      setMessage("Start a new streak today!");
    }
  }, [streak]);

  return (
    <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg flex items-center">
      <Fire className="text-orange-500 w-8 h-8 mr-3" />
      <div>
        <h3 className="text-lg font-bold text-orange-700">Streak Counter</h3>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}
