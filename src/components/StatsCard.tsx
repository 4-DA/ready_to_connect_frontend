'use client';
import { useEffect, useState } from 'react';
import {
  Star as PointsIcon,
  People as MentorshipIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  EmojiEvents as LevelIcon,
} from '@mui/icons-material';

// Define the user stats interface to match the payload
interface UserStats {
  streak: number;
  xp: number; // Changed from 'xp' to match API/ProgressSection's 'points' for consistency
  level: number;
  badge?: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    xp: 0, // Updated to 'xp' to align with API response 'points' if needed
    level: 0,
    badge: undefined,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = () => {
      try {
        // Retrieve user data from localStorage - Changed key from 'userData' to 'user' to match Signin
        const userDataJson = localStorage.getItem('user'); // Updated key name to match Signin storage
        if (userDataJson) {
          const userData = JSON.parse(userDataJson);

          // Extract and set stats - Changed 'xp' to 'points' to match ProgressSection API response
          setStats({
            streak: userData.streak || 0,
            xp: userData.xp || 0, // Consider using 'points' if API uses 'points' instead of 'xp'
            level: userData.level || 0,
            badge: userData.badge,
          });

          setLoading(false);
          return;
        }

        // If no user data found, set default values
        setStats({
          streak: 0,
          xp: 0,
          level: 0,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error retrieving user stats:', error);
        setError('Failed to load stats');
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-700 rounded-lg p-6 animate-pulse h-24"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Streak"
        value={`${stats.streak} Days`}
        bgClass="bg-gradient-to-r from-blue-500 to-blue-400"
        icon={<LocalFireDepartmentIcon />}
      />
      <StatCard
        title="XP Points"
        value={stats.xp.toLocaleString()} // Ensure this matches the stored 'xp' or 'points'
        bgClass="bg-gradient-to-r from-purple-600 to-purple-400"
        icon={<PointsIcon />}
      />
      <StatCard
        title="Level"
        value={stats.level.toString()}
        bgClass="bg-gradient-to-r from-green-500 to-green-300"
        icon={<LevelIcon />}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  bgClass: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, bgClass, icon }: StatCardProps) {
  return (
    <div className={`${bgClass} rounded-lg p-6 text-white flex flex-col`}>
      <div className="flex items-center gap-2 mb-2 text-sm opacity-90">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}