import { useGamification } from "../../../context/GamificationContext";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function DailyChallenge() {
  const { gainXp } = useGamification();
  const [completed, setCompleted] = useState(false);
  const challenge = "Complete 1 skill test today";

  const completeChallenge = () => {
    gainXp(20);
    setCompleted(true);
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-bold">{challenge}</h3>
      <button
        onClick={completeChallenge}
        className={`mt-2 px-4 py-2 rounded-full ${
          completed ? "bg-green-500" : "bg-blue-600"
        } text-white font-bold`}
        disabled={completed}
      >
        {completed ? <CheckCircle className="inline w-5 h-5" /> : "Complete"}
      </button>
    </div>
  );
}
