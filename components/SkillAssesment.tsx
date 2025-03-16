"use client";

import { useState, useEffect } from "react";
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

// Define the type for a single skill
interface Skill {
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

export default function SkillAssessmentsWithAPI() {
  const [userXP, setUserXP] = useState(750);
  const [streak, setStreak] = useState(5);
  const [currentSkillIndex, setCurrentSkillIndex] = useState<number | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lives, setLives] = useState(3);
  const [activeTab, setActiveTab] = useState<"skills" | "api-quizzes">(
    "skills"
  );

  const [skills, setSkills] = useState<Skill[]>([
    {
      name: "Coding Fundamentals",
      level: 3,
      maxLevel: 5,
      progress: 60,
      completed: false,
      difficulty: "Beginner",
      locked: false,
      questions: [
        {
          question: "What is a variable in programming?",
          options: [
            "A fixed value",
            "A storage location",
            "A function",
            "A loop",
          ],
          correctAnswer: "A storage location",
        },
        {
          question: "What does a loop do?",
          options: ["Stops code", "Repeats code", "Deletes code", "Hides code"],
          correctAnswer: "Repeats code",
        },
      ],
    },
    {
      name: "Problem Solving",
      level: 2,
      maxLevel: 5,
      progress: 85,
      completed: false,
      difficulty: "Intermediate",
      locked: false,
      questions: [
        {
          question: "What's the first step in problem-solving?",
          options: [
            "Write code",
            "Test the solution",
            "Understand the problem",
            "Debug",
          ],
          correctAnswer: "Understand the problem",
        },
        {
          question: "How do you fix a bug?",
          options: ["Ignore it", "Debug it", "Restart", "Delete it"],
          correctAnswer: "Debug it",
        },
      ],
    },
    {
      name: "Advanced Algorithms",
      level: 1,
      maxLevel: 5,
      progress: 10,
      completed: false,
      difficulty: "Advanced",
      locked: true,
      questions: [
        {
          question: "What is Big-O notation used for?",
          options: [
            "Memory allocation",
            "Time complexity",
            "Syntax checking",
            "Data storage",
          ],
          correctAnswer: "Time complexity",
        },
      ],
    },
    {
      name: "Communication Skills",
      level: 4,
      maxLevel: 5,
      progress: 20,
      completed: false,
      difficulty: "Intermediate",
      locked: false,
      questions: [
        {
          question: "What's key to effective communication?",
          options: [
            "Speaking loudly",
            "Active listening",
            "Ignoring feedback",
            "Using jargon",
          ],
          correctAnswer: "Active listening",
        },
        {
          question: "What helps in team discussions?",
          options: ["Shouting", "Listening", "Ignoring", "Leaving"],
          correctAnswer: "Listening",
        },
      ],
    },
  ]);

  // Functions for base skill assessment
  const getXPForLevel = (level: number) => level * 100;
  const getCurrentLevel = () => {
    let level = 1;
    while (userXP >= getXPForLevel(level)) level++;
    return level - 1;
  };

  const handleStartAssessment = (index: number) => {
    if (skills[index].locked) return;
    setCurrentSkillIndex(index);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setLives(3);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (currentSkillIndex === null) return;
    const skill = skills[currentSkillIndex];
    const correct =
      selectedAnswer === skill.questions[currentQuestion].correctAnswer;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playCorrect();
    } else {
      playIncorrect();
      setLives(lives - 1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (lives > 0 && currentQuestion < skill.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const updatedSkills = [...skills];
        const currentSkill = updatedSkills[currentSkillIndex];

        if (correct || lives > 0) {
          currentSkill.progress = Math.min(currentSkill.progress + 20, 100);
          setUserXP((prevXP) => prevXP + 10);
          if (
            currentSkill.progress === 100 &&
            currentSkill.level < currentSkill.maxLevel
          ) {
            currentSkill.level += 1;
            currentSkill.progress = 0;
            setUserXP((prevXP) => prevXP + 50);
            currentSkill.completed =
              currentSkill.level === currentSkill.maxLevel;
            setShowConfetti(true);
            playLevelUp();
            setTimeout(() => setShowConfetti(false), 3000);
          }
        }

        setSkills(updatedSkills);
        setCurrentSkillIndex(null);
      }
    }, 1500);
  };

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
    welcome: "Hey coder! Ready to level up? 🦉",
    correct: "Great work! Keep it up! ✨",
    incorrect: "Oops! Let's try again! 💪",
    levelUp: "Amazing! You've leveled up! 🎉",
  };

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

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [styles]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />
      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-8 relative">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md animate-pulse-once">
              <FireIcon className="mr-2 text-orange-300" />
              <span className="font-semibold text-lg">
                {streak} Day Streak!
              </span>
            </div>
            <div className="bg-gray-700 rounded-full px-4 py-2 shadow-md">
              <AwardIcon className="mr-2 text-yellow-300" />
              <span className="font-semibold text-lg">
                Level {getCurrentLevel()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/Jane-doe.png"
              alt="profile"
              height={60}
              width={60}
              className="rounded-full border-2 border-gray-500"
            />
            <div className="text-lg font-medium">John Doe</div>
          </div>
          <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-gray-600 rounded-lg p-3 shadow-md">
              <span className="text-md">{mentorMessages.welcome}</span>
            </div>
          </div>
        </header>

        <div className="bg-gray-700 rounded-lg p-4 mb-8 shadow-md">
          <div className="flex justify-between mb-2 text-md">
            <span>
              XP: {userXP} <StarIcon className="text-yellow-300" />
            </span>
            <span>Next Level: {getXPForLevel(getCurrentLevel() + 1)} XP</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4 relative overflow-hidden">
            <div
              className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${
                  ((userXP % getXPForLevel(getCurrentLevel() + 1)) /
                    getXPForLevel(getCurrentLevel() + 1)) *
                  100
                }%`,
              }}
            >
              <span className="absolute right-2 text-xs text-white">
                {Math.round(
                  ((userXP % getXPForLevel(getCurrentLevel() + 1)) /
                    getXPForLevel(getCurrentLevel() + 1)) *
                    100
                )}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
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
                {skills.map((skill, index) => (
                  <div
                    key={index}
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
                ))}
                <button
                  onClick={() => setStreak(streak + 1)}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-indigo-500 transition-all duration-200"
                >
                  Claim Streak Bonus!
                </button>
              </div>
            ) : (
              <div className="bg-gray-700 rounded-lg p-6 shadow-md">
                {showConfetti && <Confetti />}
                <h2 className="text-2xl font-semibold mb-4">
                  {
                    skills[currentSkillIndex].questions[currentQuestion]
                      .question
                  }
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
                <div className="grid gap-3">
                  {skills[currentSkillIndex].questions[
                    currentQuestion
                  ].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => !showFeedback && handleAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full p-3 border rounded-md text-md transition-all duration-200 ${
                        showFeedback &&
                        option ===
                          skills[currentSkillIndex].questions[currentQuestion]
                            .correctAnswer
                          ? "border-green-500 bg-green-100 text-green-800 animate-bounce"
                          : showFeedback
                          ? "border-gray-500 opacity-50"
                          : "border-gray-600 hover:border-indigo-500 hover:bg-gray-600"
                      }`}
                    >
                      {option}
                      {showFeedback &&
                        option ===
                          skills[currentSkillIndex].questions[currentQuestion]
                            .correctAnswer && (
                          <CheckIcon className="inline ml-2 text-green-500 animate-spin" />
                        )}
                    </button>
                  ))}
                </div>
                {showFeedback && (
                  <div
                    className={`mt-4 p-4 rounded-md ${
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
                          ? mentorMessages.correct
                          : mentorMessages.incorrect}
                        {isCorrect && " +10 XP!"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <p className="mt-2 text-sm">
                        Correct:{" "}
                        {
                          skills[currentSkillIndex].questions[currentQuestion]
                            .correctAnswer
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Show API Quiz Component when the API Quizzes tab is active
          <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-indigo-300">
                External Technical Quizzes
              </h2>
              <p className="text-gray-300 text-sm">
                Test your skills with professionally curated questions from
                across the tech industry
              </p>
            </div>
            <DynamicQuizComponent />
          </div>
        )}
      </div>
    </div>
  );
}

// Mock for the playSound functions since sound library is commented out
function playCorrect() {
  console.log("Playing correct sound");
}

function playIncorrect() {
  console.log("Playing incorrect sound");
}

function playLevelUp() {
  console.log("Playing level up sound");
}
