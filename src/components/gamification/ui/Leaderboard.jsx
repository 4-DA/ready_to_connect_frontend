import { useGamification } from "../../../context/GamificationContext";

export default function Leaderboard() {
  const { xp } = useGamification();
  const leaderboard = [
    { name: "You", xp: xp },
    { name: "Alice", xp: 1500 },
    { name: "Bob", xp: 1200 },
    { name: "Carol", xp: 900 },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold text-lg">Leaderboard</h3>
      <ul>
        {leaderboard.map((user, i) => (
          <li key={i} className="py-1">{`${i + 1}. ${user.name} - ${user.xp} XP`}</li>
        ))}
      </ul>
    </div>
  );
}
