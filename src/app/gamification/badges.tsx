'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api'; 
import Sidebar from '@/components/Sidebar';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string; // URL or Emoji depending on your backend
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await api.get('/gamification/badges/');
        setBadges(response.data);
      } catch (err) {
        console.error('Failed to load badges:', err);
        setError('Failed to load badges.');
      }
    };

    fetchBadges();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">🏅 Badge Gallery</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-[#1a1a22] p-6 rounded-lg flex flex-col items-center justify-center text-center shadow-lg"
            >
              {badge.icon ? (
                <img src={badge.icon} alt={badge.name} className="w-16 h-16 mb-3" />
              ) : (
                <div className="text-4xl mb-3">🏆</div>
              )}
              <h2 className="text-lg font-semibold mb-1">{badge.name}</h2>
              <p className="text-sm text-gray-400">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
