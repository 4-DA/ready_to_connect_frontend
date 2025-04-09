'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api'; 
import Sidebar from '@/components/Sidebar';

interface XPLog {
  id: number;
  amount: number;
  description: string;
  created_at: string;
}

export default function XPLogsPage() {
  const [xpLogs, setXPLogs] = useState<XPLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchXPLogs = async () => {
      try {
        const response = await api.get('/gamification/xp-logs/');
        setXPLogs(response.data);
      } catch (err) {
        console.error('Failed to load XP logs:', err);
        setError('Failed to load XP logs.');
      }
    };

    fetchXPLogs();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">📜 XP Activity</h1>
        <div className="bg-[#1a1a22] p-6 rounded-lg shadow-lg">
          {xpLogs.length === 0 ? (
            <p>No XP logs yet.</p>
          ) : (
            <ul className="space-y-4">
              {xpLogs.map((log) => (
                <li key={log.id} className="flex justify-between border-b border-gray-700 pb-2">
                  <div>
                    <p className="text-sm">{log.description}</p>
                    <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-green-400 font-bold">+{log.amount} XP</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
