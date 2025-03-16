"use client";

import React, { useState } from "react";
import {
  Star as StarIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as AwardIcon,
  LocalFireDepartment as FireIcon,
  Lock as LockIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  NetworkWifi as NetworkIcon,
  Terminal as TerminalIcon,
} from "@mui/icons-material";
import Confetti from "react-confetti";

// Interface definitions
interface QuizQuestion {
  id: number;
  question: string;
  description: string | null;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };
  multiple_correct_answers: string;
  correct_answers: {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct: string;
    answer_f_correct: string;
  };
  explanation: string | null;
  tip: string | null;
  tags: string[];
  category: string;
  difficulty: string;
}

interface AnswerOption {
  key: string;
  text: string;
}

interface QuizCategory {
  name: string;
  apiValue: string;
  icon: React.ReactNode;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
}

export default function APIQuizComponent() {
  const API_KEY = "jOUZSms0UIWrxBBQ4JPxhNEbIGJ3zGQNQQ7mPe3J";
  const [userXP, setUserXP] = useState(750);
  const [streak, setStreak] = useState(5);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<
    number | null
  >(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lives, setLives] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const quizCategories: QuizCategory[] = [
    {
      name: "Linux Commands",
      apiValue: "Linux",
      icon: <TerminalIcon />,
      difficulty: "Easy",
      description:
        "Test your knowledge of basic Linux commands and operations.",
    },
    {
      name: "Programming Concepts",
      apiValue: "Code",
      icon: <CodeIcon />,
      difficulty: "Medium",
      description:
        "Challenge yourself with various programming language concepts.",
    },
    {
      name: "DevOps",
      apiValue: "DevOps",
      icon: <StorageIcon />,
      difficulty: "Medium",
      description:
        "Test your DevOps knowledge with questions on CI/CD and more.",
    },
    {
      name: "Cloud Computing",
      apiValue: "Cloud",
      icon: <CloudIcon />,
      difficulty: "Hard",
      description: "Cloud service questions covering AWS, Azure, and GCP.",
    },
    {
      name: "Networking",
      apiValue: "Networking",
      icon: <NetworkIcon />,
      difficulty: "Medium",
      description:
        "Test your understanding of networking concepts and protocols.",
    },
  ];

  const getXPForLevel = (level: number): number => level * 100;

  const getCurrentLevel = (): number => {
    let level = 1;
    while (userXP >= getXPForLevel(level)) level++;
    return level - 1;
  };

  const fetchQuizQuestions = async (
    category: string,
    difficulty: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=7&category=${category}&difficulty=${difficulty.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: QuizQuestion[] = await response.json();
      if (data.length === 0) {
        throw new Error(
          "No questions returned for the selected category and difficulty"
        );
      }

      setQuestions(data);
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setIsLoading(false);
    }
  };

  const startQuiz = (index: number): void => {
    const category = quizCategories[index];
    setCurrentCategoryIndex(index);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setLives(3);
    fetchQuizQuestions(category.apiValue, category.difficulty);
  };

  const handleAnswer = (answerKey: string): void => {
    if (questions.length === 0 || showFeedback) return;

    const correctKey =
      `${answerKey}_correct` as keyof QuizQuestion["correct_answers"];
    const isAnswerCorrect =
      questions[currentQuestion].correct_answers[correctKey] === "true";

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (!isAnswerCorrect) {
      setLives((prev) => prev - 1);
    }

    setTimeout(() => {
      setShowFeedback(false);

      if (lives > 1 && currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const xpGain = isAnswerCorrect ? 15 : 5;
        setUserXP((prevXP) => prevXP + xpGain);

        if (lives === 3) {
          setUserXP((prevXP) => prevXP + 50);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }

        setCurrentCategoryIndex(null);
      }
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "text-green-300";
      case "Medium":
        return "text-blue-300";
      case "Hard":
        return "text-red-300";
      default:
        return "text-gray-400";
    }
  };

  const getAnswerOptions = (question: QuizQuestion): AnswerOption[] => {
    const options: AnswerOption[] = [];
    const answerKeys = [
      "answer_a",
      "answer_b",
      "answer_c",
      "answer_d",
      "answer_e",
      "answer_f",
    ] as const;

    answerKeys.forEach((key) => {
      if (question.answers[key]) {
        options.push({ key, text: question.answers[key] as string });
      }
    });
    return options;
  };

  return (
    <div className="p-6">
      {currentCategoryIndex === null ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Choose a Quiz Category</h2>
          {quizCategories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg shadow-md transition-all duration-300 bg-gray-800 hover:bg-gray-700 cursor-pointer"
              onClick={() => startQuiz(index)}
            >
              <div className="bg-gray-700 p-3 rounded-full">
                {category.icon}
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium">{category.name}</p>
                <p
                  className={`text-sm ${getDifficultyColor(
                    category.difficulty
                  )}`}
                >
                  {category.difficulty} | {category.description}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startQuiz(index);
                }}
                className="px-4 py-2 rounded-md text-md font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="ml-4 text-lg">Loading questions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-800 bg-opacity-30 border border-red-600 rounded-lg p-6 text-center">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => setCurrentCategoryIndex(null)}
            className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 transition-all duration-200"
          >
            Back to Categories
          </button>
        </div>
      ) : questions.length > 0 ? (
        <div>
          {showConfetti && <Confetti />}
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">
              {quizCategories[currentCategoryIndex].name} Quiz
            </span>
            <span
              className={`text-sm ${getDifficultyColor(
                quizCategories[currentCategoryIndex].difficulty
              )}`}
            >
              {quizCategories[currentCategoryIndex].difficulty}
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            {questions[currentQuestion].question}
          </h2>

          {questions[currentQuestion].description && (
            <p className="text-gray-300 mb-4">
              {questions[currentQuestion].description}
            </p>
          )}

          <div className="flex justify-between mb-4 text-sm">
            <span>
              Lives:{" "}
              {Array(lives)
                .fill(0)
                .map((_, i) => (
                  <FireIcon key={i} className="text-red-400 inline" />
                ))}
            </span>
            <span>
              Question {currentQuestion + 1}/{questions.length}
            </span>
          </div>

          <div className="grid gap-3">
            {getAnswerOptions(questions[currentQuestion]).map((option) => {
              const correctAnswerKey =
                `${option.key}_correct` as keyof QuizQuestion["correct_answers"];
              const isCorrectAnswer =
                questions[currentQuestion].correct_answers[correctAnswerKey] ===
                "true";

              return (
                <button
                  key={option.key}
                  onClick={() => handleAnswer(option.key)}
                  disabled={showFeedback}
                  className={`w-full p-3 border text-left rounded-md text-md transition-all duration-200 ${
                    showFeedback && isCorrectAnswer
                      ? "border-green-500 bg-green-800 bg-opacity-30 text-green-300"
                      : showFeedback
                      ? "border-gray-500 opacity-50"
                      : "border-gray-600 hover:border-indigo-500 hover:bg-gray-600"
                  }`}
                >
                  {option.text}
                  {showFeedback && isCorrectAnswer && (
                    <CheckIcon className="inline ml-2 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`mt-4 p-4 rounded-md ${
                isCorrect
                  ? "bg-green-800 bg-opacity-30 border border-green-600 text-green-300"
                  : "bg-red-800 bg-opacity-30 border border-red-600 text-red-300"
              }`}
            >
              <div className="flex items-center">
                {isCorrect ? (
                  <CheckIcon className="mr-2 text-xl" />
                ) : (
                  <FireIcon className="mr-2 text-xl" />
                )}
                <span className="text-md">
                  {isCorrect ? "Correct! +15 XP" : "Incorrect. Keep going!"}
                </span>
              </div>
              {questions[currentQuestion].explanation && (
                <p className="mt-2 text-sm">
                  {questions[currentQuestion].explanation}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-lg mb-4">
            No questions available for this category.
          </p>
          <button
            onClick={() => setCurrentCategoryIndex(null)}
            className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 transition-all duration-200"
          >
            Back to Categories
          </button>
        </div>
      )}
    </div>
  );
}
