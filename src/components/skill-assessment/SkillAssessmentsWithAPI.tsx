"use client";

import React, { useState, useEffect } from "react";
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
import Image from "next/image";
import Sidebar from "../Sidebar";
import Confetti from "react-confetti";
import DynamicQuizComponent from "./DynamicQuiz";
import toast from "react-hot-toast";
import api from "@/utils/api"; 

// --------------------
// Interfaces
// --------------------
interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  progress: number; // Percentage (0-100)
  completed: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  locked: boolean;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

interface UserStats {
  xp: number;
  streak: number;
  level: number;
}

interface SkillAssessmentResponse {
  skills: Skill[];
  userStats: UserStats;
  careerInterest: string; // e.g. "Computer Science"
}

// For user profile
interface UserProfile {
  full_name?: string;
  initials?: string;
}

// --------------------
// Main Component
// --------------------
export default function SkillAssessmentsWithAPI() {
  // --------------------
  // State
  // --------------------
  const [userXP, setUserXP] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [careerInterest, setCareerInterest] = useState<string>("");

  const [userName, setUserName] = useState<string>("User");
  const [userInitials, setUserInitials] = useState<string>("U");

  const [currentSkillIndex, setCurrentSkillIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "api-quizzes">("skills");

  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // --------------------
  // CSS Animations (optional)
  // --------------------
  const styles = `
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-bounce { animation: bounce 0.5s ease-in-out; }
    .animate-pulse { animation: pulse 1s ease-in-out infinite; }
    .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
    .animate-spin { animation: spin 1s linear infinite; }
    .animate-pulse-once { animation: pulse 1s ease-in-out 1; }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [styles]);

  // --------------------
  // Fetch Topics + Profile + Dashboard
  // --------------------
  const fetchSkillAssessments = async () => {
    try {
      const topicsRes = await api.get("/gamification/career-topics/");
      const topicData = topicsRes.data;
      setTopics(topicData.suggestedTopics || []);

      const profileRes = await api.get("/accounts/auth/user/");
      const profileData: UserProfile = profileRes.data;

      if (profileData.full_name) {
        setUserName(profileData.full_name);
        const initials = profileData.full_name
          .split(" ")
          .map((part) => part[0]?.toUpperCase() || "")
          .join("");
        setUserInitials(initials || "U");
      }

      const dashboardRes = await api.get("/gamification/dashboard/");
      const dashboardData = dashboardRes.data;
      setUserXP(dashboardData.total_xp || 0);
      setStreak(dashboardData.current_streak || 0);
      setLevel(dashboardData.current_level || 1);
    } catch (err: any) {
      console.error("Error fetching skill assessments:", err);
      setError(err.message || "Failed to load assessments");
    }
  };

  // --------------------
  // Generate Quizzes for a Chosen Topic
  // --------------------
  const fetchQuizzesForTopic = async (topic: string) => {
    try {
      const quizRes = await api.post("/gamification/skill-quizzes/", { topic });
      const quizData: SkillAssessmentResponse & { topic: string } = quizRes.data;

      setSkills(quizData.skills);
      setCareerInterest(quizData.careerInterest);
      setSelectedTopic(topic);
    } catch (err: any) {
      console.error("Error generating quizzes:", err);
      toast.error(err.message || "Failed to generate quizzes.");
    }
  };

  // --------------------
  // Save quiz progress
  // --------------------
  const saveQuizProgress = async (xpGained: number, streakChange: number) => {
    try {
      const res = await api.post("/gamification/quiz-progress/", {
        xp: xpGained,
        streak: streakChange,
      });
      console.log("Progress updated:", res.data);

      if (typeof (globalThis as any).refreshUserData === "function") {
        await (globalThis as any).refreshUserData();
      }

      toast.success(
        `Progress saved: +${xpGained} XP, streak ${
          streakChange >= 0 ? "increased" : "decreased"
        }.`
      );
    } catch (err: any) {
      console.error("Error saving quiz progress:", err);
      toast.error("Failed to save your progress. Please try again.");
    }
  };

  useEffect(() => {
    fetchSkillAssessments();
  }, []);

  const handleStartAssessment = (index: number) => {
    if (skills[index].locked) return;
    setCurrentSkillIndex(index);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setLives(3);
  };

  const awardXP = (earnedXP: number) => {
    const newXP = userXP + earnedXP;
    setUserXP(newXP);
    toast.success(`+${earnedXP} XP earned!`);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (currentSkillIndex === null) return;
    const skill = skills[currentSkillIndex];
    const correctAnswer = skill.questions[currentQuestion].correctAnswer;
    const correct = selectedAnswer === correctAnswer;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (!correct) {
      setLives((prev) => prev - 1);
    }

    setTimeout(async () => {
      setShowFeedback(false);

      if (lives > 0 && currentQuestion < skill.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const xpEarned = (correct ? 15 : 5) + (lives === 3 ? 50 : 0);
        awardXP(xpEarned);
        await saveQuizProgress(xpEarned, correct ? 1 : -1);

        if (lives === 3) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        setCurrentSkillIndex(null);
      }
    }, 1500);
  };

  const getXPForLevel = (lvl: number) => lvl * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-300";
      case "Intermediate":
        return "text-blue-300";
      case "Advanced":
        return "text-red-300";
      default:
        return "text-gray-400";
    }
  };

  const mentorMessages = {
    welcome: `Hey! Ready to level up in ${careerInterest}?`,
    correct: "Great work! Keep it up!",
    incorrect: "Oops! Let's try again!",
    levelUp: "Amazing! You've leveled up!",
  };

  // --------------------
  // Render
  // --------------------
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />
  
      <div className="flex-1 p-6 pl-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 relative">
          <div className="flex items-center space-x-4">
            {/* Streak */}
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md animate-pulse-once flex items-center">
              <FireIcon className="mr-2 text-orange-300" />
              <span className="font-semibold text-lg">{streak} Day Streak!</span>
            </div>
  
            {/* Level */}
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md flex items-center">
              <AwardIcon className="mr-2 text-yellow-300" />
              <span className="font-semibold text-lg">Level {level}</span>
            </div>
          </div>
  
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-xl uppercase">
                {userInitials}
              </div>
            </div>
            <div className="text-lg font-medium">{userName}</div>
          </div>
  
          {/* Mentor welcome bubble */}
          <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-gray-600 rounded-lg p-3 shadow-md">
              <span className="text-md">{mentorMessages.welcome}</span>
            </div>
          </div>
        </header>
  
        {/* XP Progress Card */}
        <div className="bg-gray-700 rounded-lg p-4 mb-8 shadow-md">
          <div className="flex justify-between mb-2 text-md">
            <span>
              XP: {userXP} <StarIcon className="text-yellow-300" />
            </span>
            <span>Next Level: {getXPForLevel(level + 1)} XP</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4 relative overflow-hidden">
            <div
              className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${((userXP % getXPForLevel(level + 1)) / getXPForLevel(level + 1)) * 100}%`,
              }}
            >
              <span className="absolute right-2 text-xs text-white">
                {Math.round(((userXP % getXPForLevel(level + 1)) / getXPForLevel(level + 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
              activeTab === "skills"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("skills")}
          >
            Skill Assessments
          </button>
          <button
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
              activeTab === "api-quizzes"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("api-quizzes")}
          >
            Technical Quizzes
          </button>
        </div>
  
        {/* Main Content */}
        {activeTab === "skills" ? (
          <>
            {/* If no topic selected */}
            {selectedTopic === null ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Select Your Topic
                </h2>
                {topics.length > 0 ? (
                  topics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => fetchQuizzesForTopic(topic)}
                      className="block w-full bg-gray-700 hover:bg-indigo-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 text-center"
                    >
                      {topic}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg">No topics available at this time.</p>
                  </div>
                )}
              </div>
            ) : currentSkillIndex === null ? (
              /* If topic selected but no quiz started yet */
              <div className="space-y-4">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <div
                      key={skill.id || index}
                      className={`flex items-center gap-4 p-4 rounded-lg shadow-md transition-all duration-300 ${
                        skill.locked
                          ? "bg-gray-600 opacity-70 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {/* Progress or Lock */}
                      <div className="relative w-12 h-12">
                        {skill.locked ? (
                          <LockIcon className="text-gray-400 w-full h-full" />
                        ) : (
                          <>
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                className="text-gray-500"
                                fill="none"
                                strokeWidth="3"
                                stroke="currentColor"
                                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-indigo-400"
                                fill="none"
                                strokeWidth="3"
                                strokeDasharray={`${skill.progress}, 100`}
                                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {skill.level}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
  
                      {/* Skill Info */}
                      <div className="flex-1">
                        <p className="text-lg font-medium">{skill.name || "Unnamed Skill"}</p>
                        <p className={`text-sm ${getDifficultyColor(skill.difficulty)}`}>
                          {skill.locked
                            ? "Locked"
                            : `${skill.difficulty} | Level ${skill.level}/${skill.maxLevel}`}
                        </p>
                      </div>
  
                      {/* Start Button */}
                      <button
                        onClick={() => handleStartAssessment(index)}
                        disabled={skill.locked}
                        className={`px-4 py-2 rounded-md text-md font-medium ${
                          skill.locked
                            ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                            : skill.completed
                            ? "bg-green-500 text-white animate-pulse"
                            : "bg-gray-500 text-white hover:bg-indigo-500"
                        } transition-all duration-200`}
                      >
                        {skill.locked
                          ? "Locked"
                          : skill.completed
                          ? "Completed"
                          : "Start"}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg">No assessments available yet.</p>
                  </div>
                )}
              </div>
            ) : (
              /* If a quiz is currently in progress */
              <div className="bg-gray-700 rounded-lg p-6 shadow-md">
                {showConfetti && <Confetti />}
                <h2 className="text-2xl font-semibold mb-4">
                  {skills[currentSkillIndex].questions[currentQuestion].question}
                </h2>
  
                {/* Lives and Question Progress */}
                <div className="flex justify-between mb-4 text-sm">
                  <span>
                    Lives:{" "}
                    {Array(lives)
                      .fill(0)
                      .map((_, idx) => (
                        <FireIcon key={idx} className="text-red-400 inline" />
                      ))}
                  </span>
                  <span>
                    Question {currentQuestion + 1}/{skills[currentSkillIndex].questions.length}
                  </span>
                </div>
  
                {/* Answer Options */}
                <div className="grid gap-3">
                  {skills[currentSkillIndex].questions[currentQuestion].options.map(
                    (option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        disabled={showFeedback}
                        className={`w-full p-3 border rounded-md text-md transition-all duration-200 ${
                          showFeedback
                            ? "border-gray-500 opacity-50"
                            : "border-gray-600 hover:border-indigo-500 hover:bg-gray-600"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{String.fromCharCode(65 + idx)}</span>
                          <span>{option}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
  
                {/* Feedback Message */}
                {showFeedback && (
                  <div
                    className={`mt-6 p-4 rounded-md ${
                      isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    } animate-fade-in`}
                  >
                    <div className="flex items-center">
                      {isCorrect ? (
                        <CheckIcon className="mr-2 text-xl animate-bounce" />
                      ) : (
                        <FireIcon className="mr-2 text-xl animate-pulse" />
                      )}
                      <span className="text-md">
                        {isCorrect
                          ? mentorMessages.correct + " +10 XP!"
                          : mentorMessages.incorrect}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* If Technical Quizzes tab is selected */
          <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-indigo-300">
                External Technical Quizzes
              </h2>
              <p className="text-gray-300 text-sm">
                Test your skills with professionally curated questions in{" "}
                <strong>{careerInterest}</strong>.
              </p>
            </div>
            <DynamicQuizComponent />
          </div>
        )}
      </div>
    </div>
  );
  
}
