'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api'; // your axios instance
import Sidebar from '@/components/Sidebar';

interface LeaderboardUser {
  id: number;
  email: string;
  user_type: string;
  total_xp: number;
  current_level: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/gamification/leaderboard/');
        setLeaderboard(response.data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading Leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">🏆 Leaderboard</h1>
        <div className="bg-[#1a1a22] p-6 rounded-lg shadow-lg">
          {leaderboard.length === 0 ? (
            <p>No users on the leaderboard yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase">
                  <th className="pb-2">#</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2">User Type</th>
                  <th className="pb-2">Level</th>
                  <th className="pb-2">XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <tr key={user.id} className="border-t border-gray-700">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.user_type}</td>
                    <td className="py-2">{user.current_level}</td>
                    <td className="py-2">{user.total_xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
