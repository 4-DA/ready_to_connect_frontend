export default function StreakCounter({ streak }: { streak: number }) {
    return (
      <div className="bg-dark-light p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-2">🔥 Streak</h3>
        <p className="text-2xl text-primary">{streak} days</p>
      </div>
    );
  }
  