import { useGamification } from "../../../context/GamificationContext";
import { Medal } from "lucide-react";

export default function BadgeGallery() {
  const { badges } = useGamification();

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold text-lg flex items-center">
        <Medal className="w-6 h-6 mr-2" /> Badge Gallery
      </h3>
      {badges.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-3">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md border border-gray-200"
            >
              <Medal className="w-8 h-8 text-yellow-500" />
              <p className="text-sm font-medium mt-2">{badge}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-4">No badges earned yet. Keep leveling up!</p>
      )}
    </div>
  );
}
