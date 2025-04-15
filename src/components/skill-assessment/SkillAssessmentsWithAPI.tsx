"use client";

import React, { useState, useEffect } from "react";
import {
  Star as StarIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as AwardIcon,
  LocalFireDepartment as FireIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
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
  progress: number;
  completed: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  locked: boolean;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

interface SkillAssessmentResponse {
  skills: Skill[];
  userStats: {
    xp: number;
    streak: number;
    level: number;
  };
  careerInterest: string;
  courseAssigned: string;
}

interface UserProfile {
  full_name?: string;
}

interface PastQuiz {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  progress: number;
  completed: boolean;
  difficulty: string;
  locked: boolean;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

// --------------------
// Main Component
// --------------------
export default function SkillAssessmentsWithAPI() {
  const [userXP, setUserXP] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pastQuizzes, setPastQuizzes] = useState<PastQuiz[]>([]);
  const [careerInterest, setCareerInterest] = useState<string>("");
  const [courseAssigned, setCourseAssigned] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("");
  const [completedSkillIds, setCompletedSkillIds] = useState<string[]>([]);

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isLoadingPastQuizzes, setIsLoadingPastQuizzes] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentSkillIndex, setCurrentSkillIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<"skills" | "api-quizzes" | "past">("skills");

  // --------------------
  // Fetch Data
  // --------------------
  useEffect(() => {
    fetchUserProfile();
    fetchDashboard();
    fetchTopics();
    fetchPastQuizzes();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/accounts/auth/user/");
      const data: UserProfile = res.data;
      if (data.full_name) {
        setUserName(data.full_name);
        const initials = data.full_name
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase();
        setUserInitials(initials);
      }
    } catch (err) {
      console.error("Error fetching user profile", err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/gamification/dashboard/");
      const dashboardData = res.data;
      setUserXP(dashboardData.total_xp || 0);
      setStreak(dashboardData.current_streak || 0);
      setLevel(dashboardData.current_level || 1);
    } catch (err) {
      console.error("Error fetching dashboard", err);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await api.get("/gamification/career-topics/");
      setTopics(res.data.suggestedTopics || []);
      setCareerInterest(res.data.careerInterest || "");
    } catch (err) {
      console.error("Error fetching topics", err);
      setError("Failed to load topics");
      toast.error("Failed to load topics.");
    }
  };

  const fetchQuizzesForTopic = async (topic: string) => {
    try {
      setIsLoadingSkills(true);
      const res = await api.post("/gamification/skill-quizzes/", { topic });
      const data: SkillAssessmentResponse = res.data;
      // Filter out completed skills to prevent repeats
      const availableSkills = data.skills.filter(
        (skill) => !completedSkillIds.includes(skill.id)
      );
      setSkills(availableSkills);
      setCareerInterest(data.careerInterest);
      setCourseAssigned(data.courseAssigned || "No course assigned");
      setSelectedTopic(topic);
    } catch (err) {
      console.error("Error fetching quizzes", err);
      toast.error("Failed to generate quizzes.");
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const fetchPastQuizzes = async () => {
    try {
      setIsLoadingPastQuizzes(true);
      const res = await api.get("/gamification/past-skill-quizzes/");
      setPastQuizzes(res.data || []);
      setCompletedSkillIds(res.data.map((quiz: PastQuiz) => quiz.id));
    } catch (err) {
      console.error("Error fetching past quizzes", err);
      toast.error("Failed to load past quizzes.");
    } finally {
      setIsLoadingPastQuizzes(false);
    }
  };

  // --------------------
  // Quiz Actions
  // --------------------
  const handleStartAssessment = (index: number) => {
    if (skills[index].locked || skills[index].completed) return;
    setCurrentSkillIndex(index);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setLives(3);
  };

  const handleAnswer = async (selectedAnswer: string) => {
    if (currentSkillIndex === null) return;
    const skill = skills[currentSkillIndex];
    const correctAnswer = skill.questions[currentQuestion].correctAnswer;
    const questionId = skill.questions[currentQuestion].id;
    const correct = selectedAnswer === correctAnswer;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (!correct) {
      setLives((prev) => prev - 1);
    }

    setTimeout(async () => {
      setShowFeedback(false);
      if (lives > 1 && currentQuestion < skill.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const xpEarned = (correct ? 15 : 5) + (lives === 3 ? 50 : 0);
        const progress = Math.min(
          skill.progress + (correct ? 20 : 5),
          100
        );
        const completed = progress >= 100;

        // Prepare quiz submission for backend
        const answers = skill.questions.map((q, idx) => ({
          question_id: q.id,
          answer: idx === currentQuestion ? selectedAnswer : q.correctAnswer, // Simulate previous answers
        }));

        try {
          await api.post("/gamification/quiz-submission/", {
            quiz_id: skill.id,
            answers,
          });
          // Update skill state
          setSkills((prev) =>
            prev.map((s, idx) =>
              idx === currentSkillIndex
                ? { ...s, progress, completed }
                : s
            )
          );
          if (completed) {
            setCompletedSkillIds((prev) => [...prev, skill.id]);
            setPastQuizzes((prev) => [
              ...prev,
              { ...skill, progress, completed },
            ]);
          }
        } catch (err) {
          console.error("Error submitting quiz", err);
          toast.error("Failed to save quiz progress.");
        }

        setUserXP((prev) => prev + xpEarned);
        if (lives === 3 && completed) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        setCurrentSkillIndex(null);
        setCurrentQuestion(0);
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
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md">
              <FireIcon className="mr-2 text-orange-300" />
              <span className="font-semibold text-lg">
                {isLoadingDashboard ? "..." : `${streak} Day Streak!`}
              </span>
            </div>
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md">
              <AwardIcon className="mr-2 text-yellow-300" />
              <span className="font-semibold text-lg">
                {isLoadingDashboard ? "..." : `Level ${level}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              {isLoadingUser ? (
                <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl uppercase">
                  {userInitials}
                </div>
              )}
            </div>
            <div className="text-lg font-medium">
              {isLoadingUser ? (
                <div className="w-20 h-4 bg-gray-600 animate-pulse rounded" />
              ) : (
                userName
              )}
            </div>
          </div>

          <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-gray-600 rounded-lg p-3 shadow-md">
              <span className="text-md">
                Hey{userName ? ` ${userName.split(" ")[0]}` : ""}, ready to level up in {careerInterest || "your career"}?
              </span>
            </div>
          </div>
        </header>

        {/* XP Progress */}
        <div className="bg-gray-700 rounded-lg p-4 mb-8 shadow-md">
          <div className="flex justify-between mb-2 text-md">
            <span>
              XP: {userXP} <StarIcon className="text-yellow-300" />
            </span>
            <span>Next Level: {getXPForLevel(level + 1)} XP</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4 overflow-hidden">
            <div
              className="bg-indigo-600 h-4 transition-all duration-1000 ease-out"
              style={{
                width: `${((userXP % getXPForLevel(level + 1)) / getXPForLevel(level + 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
              activeTab === "skills" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("skills")}
          >
            Skill Assessments
          </button>
          <button
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
              activeTab === "api-quizzes" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("api-quizzes")}
          >
            Technical Quizzes
          </button>
          <button
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
              activeTab === "past" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Quizzes
          </button>
        </div>

        {/* Course Banner */}
        {courseAssigned && selectedTopic && (
          <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Assigned Course</h3>
            <p className="text-gray-300">{courseAssigned}</p>
          </div>
        )}

        {/* Main Content */}
        {activeTab === "skills" ? (
          <>
            {currentSkillIndex !== null ? (
              // Quiz Mode
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {skills[currentSkillIndex].name}
                </h2>

                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <p className="text-lg font-medium mb-4">
                    {skills[currentSkillIndex].questions[currentQuestion]?.question}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {skills[currentSkillIndex].questions[currentQuestion]?.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md"
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 text-sm text-gray-300">
                    {lives} Lives Left
                  </div>
                </div>

                {/* Feedback Message */}
                {showFeedback && (
                  <div className="text-center mt-6">
                    {isCorrect ? (
                      <div className="text-green-400 font-bold">Correct! 🎯</div>
                    ) : (
                      <div className="text-red-400 font-bold">Wrong! ❌</div>
                    )}
                  </div>
                )}

                {/* Confetti */}
                {showConfetti && <Confetti />}
              </div>
            ) : selectedTopic === null ? (
              // Topic Selection
              <div className="space-y-4">
                {topics.length > 0 ? (
                  topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => fetchQuizzesForTopic(topic)}
                      className="block w-full bg-gray-700 hover:bg-indigo-600 text-white p-4 rounded-lg shadow-md"
                    >
                      {topic}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">No topics available.</div>
                )}
              </div>
            ) : (
              // Skill List
              <div className="space-y-4">
                {isLoadingSkills ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-24 bg-gray-600 animate-pulse rounded-lg"
                      />
                    ))}
                  </div>
                ) : skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className={`flex items-center gap-4 p-4 rounded-lg shadow-md transition-all duration-300 ${
                        skill.locked || skill.completed
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
                        <p className={`text-sm ${getDifficultyColor(skill.difficulty)}`}>
                          {skill.locked
                            ? "Locked"
                            : skill.completed
                            ? "Completed"
                            : `${skill.difficulty} | Level ${skill.level}/${skill.maxLevel}`}
                        </p>
                      </div>

                      <button
                        onClick={() => handleStartAssessment(index)}
                        disabled={skill.locked || skill.completed}
                        className={`px-4 py-2 rounded-md text-md font-medium ${
                          skill.locked || skill.completed
                            ? "bg-gray-500 text-gray-400 cursor-not-allowed"
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
            )}
          </>
        ) : activeTab === "api-quizzes" ? (
          <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <DynamicQuizComponent />
          </div>
        ) : (
          // Past Quizzes
          <div className="space-y-4">
            {isLoadingPastQuizzes ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-24 bg-gray-600 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : pastQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg">No past quizzes completed yet.</p>
              </div>
            ) : (
              pastQuizzes.map((quiz, idx) => (
                <div
                  key={quiz.id}
                  className="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                >
                  <h4 className="text-xl font-semibold">{quiz.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    {quiz.difficulty} | Level {quiz.level}/{quiz.maxLevel} | {quiz.progress}% Completed
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quiz.questions.map((q, index) => (
                      <div
                        key={q.id}
                        className="bg-gray-800 p-3 rounded-lg text-sm text-gray-200 w-full"
                      >
                        <strong>Q:</strong> {q.question}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}