// src/types/gamification.d.ts

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }
  
  export interface UserStats {
    xp: number;
    streak: number;
    level: number;
  }
  
  export interface Skill {
    id: string;
    name: string;
    level: number;
    maxLevel: number;
    progress: number; // Percentage (0-100)
    completed: boolean;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    locked: boolean;
    questions: {
      question: string;
      options: string[];
      correctAnswer: string;
    }[];
  }
  