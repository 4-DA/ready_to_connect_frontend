import { useGamification } from "../../../context/GamificationContext";

export default function ProgressBar() {
  const { xp, level } = useGamification();
  const progress = (xp % 100) / 100 * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 relative">
      <div
        className="bg-blue-600 h-3 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="absolute right-2 text-sm font-bold text-gray-800">
        Level {level}
      </span>
    </div>
  );
}
