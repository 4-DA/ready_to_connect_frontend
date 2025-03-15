import { useGamification } from "../../../context/GamificationContext";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function RewardStore() {
  const { coins, setCoins } = useGamification();
  const [purchased, setPurchased] = useState([]);

  const rewards = [
    { id: 1, name: "XP Boost", cost: 50 },
    { id: 2, name: "Custom Theme", cost: 100 },
    { id: 3, name: "Extra Life", cost: 75 },
  ];

  const handlePurchase = (reward) => {
    if (coins >= reward.cost && !purchased.includes(reward.id)) {
      setPurchased([...purchased, reward.id]);
      setCoins((prev) => prev - reward.cost);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold text-lg flex items-center">
        <ShoppingBag className="w-6 h-6 mr-2" /> Reward Store
      </h3>
      <div className="mt-3 space-y-3">
        {rewards.map((reward) => (
          <button
            key={reward.id}
            onClick={() => handlePurchase(reward)}
            disabled={coins < reward.cost || purchased.includes(reward.id)}
            className={`w-full flex justify-between items-center px-4 py-2 rounded-lg font-medium ${
              purchased.includes(reward.id)
                ? "bg-green-500 text-white cursor-not-allowed"
                : coins >= reward.cost
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>{reward.name}</span>
            <span>
              {reward.cost} Coins{" "}
              {purchased.includes(reward.id) && <CheckCircle className="inline w-5 h-5 ml-2" />}
            </span>
          </button>
        ))}
      </div>
      <p className="text-center mt-4 text-sm text-gray-600">You have {coins} Coins</p>
    </div>
  );
}
