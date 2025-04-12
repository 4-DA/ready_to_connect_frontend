// src/services/gamificationService.ts

import axios from 'axios';

export const saveQuizProgress = async (xpGained: number, streakChange: number) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  if (!token) {
    throw new Error('Authentication token not found.');
  }

  try {
    const response = await axios.post(
      '/api/gamification/quiz-progress/',
      {
        xp: xpGained,
        streak: streakChange,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving quiz progress:', error);
    throw error;
  }
};
