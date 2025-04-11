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
import Sidebar from "./Sidebar";
import Confetti from "react-confetti";
import DynamicQuizComponent from "./DynamicQuiz";
import toast from "react-hot-toast";

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

  // Display user name or initials
  const [userName, setUserName] = useState<string>("User");
  const [userInitials, setUserInitials] = useState<string>("U");

  // Local quiz state
  const [currentSkillIndex, setCurrentSkillIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "api-quizzes">("skills");

  // Inject custom styles for animations
  const styles = `
    @keyframes bounce { 
      0%, 100% { transform: translateY(0); } 
      50% { transform: translateY(-8px); } 
    }
    @keyframes pulse { 
      0%, 100% { opacity: 1; } 
      50% { opacity: 0.6; } 
    }
    @keyframes fade-in { 
      from { opacity: 0; } 
      to { opacity: 1; } 
    }
    @keyframes spin { 
      from { transform: rotate(0deg); } 
      to { transform: rotate(360deg); } 
    }
    .animate-bounce { animation: bounce 0.5s ease-in-out; }
    .animate-pulse { animation: pulse 1s ease-in-out infinite; }
    .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
    .animate-spin { animation: spin 1s linear infinite; }
    .animate-pulse-once { animation: pulse 1s ease-in-out 1; }
  `;

  // Add style block on mount
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [styles]);

  // --------------------
  // Fetch Skill Assessments
  // + (optional) Fetch Profile
  // --------------------
  const fetchSkillAssessments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token not found.");

      // 1) Fetch skill-based quizzes
      const quizRes = await fetch("/gamification/skill-quizzes/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!quizRes.ok) {
        throw new Error(`Failed to load skill assessments: ${quizRes.status}`);
      }
      const data: SkillAssessmentResponse = await quizRes.json();

      setSkills(data.skills);
      setUserXP(data.userStats.xp);
      setStreak(data.userStats.streak);
      setLevel(data.userStats.level);
      setCareerInterest(data.careerInterest);

      // 2) Optionally fetch user profile for name or initials
      const profileRes = await fetch("/accounts/auth/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (profileRes.ok) {
        const profileData: UserProfile = await profileRes.json();
        if (profileData.full_name) {
          setUserName(profileData.full_name);
          const initials = profileData.full_name
            .split(" ")
            .map((part) => part[0]?.toUpperCase() || "")
            .join("");
          setUserInitials(initials || "U");
        }
      }
    } catch (err: any) {
      console.error("Error fetching skill assessments:", err);
      setError(err.message || "Failed to load assessments");
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchSkillAssessments();
  }, []);

  // --------------------
  // Utility: XP for next level
  // --------------------
  const getXPForLevel = (lvl: number) => lvl * 100;

  // Recalc level from XP if needed
  const recalcLevel = (xp: number) => {
    let computedLevel = 1;
    while (xp >= getXPForLevel(computedLevel)) computedLevel++;
    return computedLevel - 1;
  };

  // --------------------
  // Start a skill quiz
  // --------------------
  const handleStartAssessment = (index: number) => {
    if (skills[index].locked) return;
    setCurrentSkillIndex(index);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setLives(3);
  };

  // Award XP locally
  const awardXP = (earnedXP: number) => {
    const newXP = userXP + earnedXP;
    setUserXP(newXP);
    toast.success(`+${earnedXP} XP earned!`);
  };

  // Save quiz progress to backend
  const saveQuizProgress = async (xpGained: number, streakChange: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No auth token found.");
      return;
    }
    try {
      const response = await fetch("/api/gamification/quiz-progress/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          xp: xpGained,
          streak: streakChange,
        }),
      });

      if (!response.ok) {
        throw new Error(`Progress update failed: ${response.status}`);
      }
      const result = await response.json();
      console.log("Progress updated:", result);

      // Possibly refresh dashboard data
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

  // --------------------
  // Handle an answer
  // --------------------
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

      // If not done
      if (lives > 0 && currentQuestion < skill.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // End of quiz
        const xpEarned = (correct ? 15 : 5) + (lives === 3 ? 50 : 0);
        awardXP(xpEarned);
        await saveQuizProgress(xpEarned, correct ? 1 : -1);

        // Confetti if perfect
        if (lives === 3) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        // Reset
        setCurrentSkillIndex(null);
      }
    }, 1500);
  };

  // Color for difficulty text
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

  // Mentor messages
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
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md animate-pulse-once">
              <FireIcon className="mr-2 text-orange-300" />
              <span className="font-semibold text-lg">{streak} Day Streak!</span>
            </div>
            {/* Level */}
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md">
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

          <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-gray-600 rounded-lg p-3 shadow-md">
              <span className="text-md">{mentorMessages.welcome}</span>
            </div>
          </div>
        </header>

        {/* User XP Card */}
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
                width: `${
                  ((userXP % getXPForLevel(level + 1)) /
                    getXPForLevel(level + 1)) * 100
                }%`,
              }}
            >
              <span className="absolute right-2 text-xs text-white">
                {Math.round(
                  ((userXP % getXPForLevel(level + 1)) /
                    getXPForLevel(level + 1)) * 100
                )}
                %
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

        {activeTab === "skills" ? (
          <>
            {currentSkillIndex === null ? (
              <div className="space-y-4">
                {/* If we have skills, list them */}
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className={`flex items-center gap-4 p-4 rounded-lg shadow-md transition-all duration-300 ${
                        skill.locked
                          ? "bg-gray-600 opacity-70 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
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
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-indigo-400"
                                fill="none"
                                strokeWidth="3"
                                strokeDasharray={`${skill.progress}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
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
                      <div className="flex-1">
                        <p className="text-lg font-medium">{skill.name}</p>
                        <p
                          className={`text-sm ${getDifficultyColor(
                            skill.difficulty
                          )}`}
                        >
                          {skill.locked
                            ? "Locked"
                            : `${skill.difficulty} | Level ${skill.level}/${skill.maxLevel}`}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleStartAssessment(
                            skills.findIndex((s) => s.id === skill.id)
                          )
                        }
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
                    <p className="text-lg">
                      No assessments available for your career interest.
                    </p>
                  </div>
                )}
                {/* Example "Claim Streak Bonus" button for demonstration */}
                <button
                  onClick={() => setStreak((prev) => prev + 1)}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-indigo-500 transition-all duration-200"
                >
                  Claim Streak Bonus!
                </button>
              </div>
            ) : (
              // If a skill is selected, show the questions
              <div className="bg-gray-700 rounded-lg p-6 shadow-md">
                {showConfetti && <Confetti />}

                <h2 className="text-2xl font-semibold mb-4">
                  {skills[currentSkillIndex].questions[currentQuestion].question}
                </h2>

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
                    Question {currentQuestion + 1}/
                    {skills[currentSkillIndex].questions.length}
                  </span>
                </div>

                {/* Answer options */}
                <div className="grid gap-3">
                  {skills[currentSkillIndex].questions[
                    currentQuestion
                  ].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full p-3 border rounded-md text-md transition-all duration-200 ${
                        showFeedback &&
                        idx ===
                          Number(
                            skills[currentSkillIndex].questions[currentQuestion]
                              .correctAnswer
                          )
                          ? "border-green-500 bg-green-100 text-green-800 animate-bounce"
                          : showFeedback
                          ? "border-gray-500 opacity-50"
                          : "border-gray-600 hover:border-indigo-500 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                        {showFeedback &&
                          idx ===
                            Number(
                              skills[currentSkillIndex].questions[
                                currentQuestion
                              ].correctAnswer
                            ) && (
                            <CheckIcon className="ml-auto text-green-500 animate-spin" />
                          )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback box */}
                {showFeedback && (
                  <div
                    className={`mt-6 p-4 rounded-md ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
          // If "api-quizzes" tab is selected, show your external quiz UI
          <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-indigo-300">
                External Technical Quizzes
              </h2>
              <p className="text-gray-300 text-sm">
                Test your skills with professionally curated questions from the <strong>{careerInterest}</strong> field.
              </p>
            </div>
            {/* The dynamic quiz component (like a broader school subject quiz) */}
            <DynamicQuizComponent />
          </div>
        )}
      </div>
    </div>
  );
}

// OPTIONAL: Sound mocks
function playCorrect() {
  console.log("Playing correct sound");
}
function playIncorrect() {
  console.log("Playing incorrect sound");
}
function playLevelUp() {
  console.log("Playing level up sound");
}
