"use client";

import { useState } from "react";
import {
  Star as StarIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalFireDepartment as FireIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import Image from "next/image";
import Sidebar from "./Sidebar";

// Define the type for a single skill
interface Skill {
  name: string;
  level: number;
  maxLevel: number;
  progress: number; // Percentage (0-100)
  completed: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  locked: boolean;
}

export default function SkillAssessments() {
  const [userXP, setUserXP] = useState(750);
  const [streak, setStreak] = useState(5);
  const [skills, setSkills] = useState<Skill[]>([
    {
      name: "Coding Fundamentals",
      level: 3,
      maxLevel: 5,
      progress: 60,
      completed: false,
      difficulty: "Beginner",
      locked: false,
    },
    {
      name: "Problem Solving",
      level: 2,
      maxLevel: 5,
      progress: 85,
      completed: false,
      difficulty: "Intermediate",
      locked: false,
    },
    {
      name: "Advanced Algorithms",
      level: 1,
      maxLevel: 5,
      progress: 10,
      completed: false,
      difficulty: "Advanced",
      locked: true,
    },
    {
      name: "Communication Skills",
      level: 4,
      maxLevel: 5,
      progress: 20,
      completed: false,
      difficulty: "Intermediate",
      locked: false,
    },
  ]);

  const getXPForLevel = (level: number) => {
    return level * 100;
  };

  const getCurrentLevel = () => {
    let level = 1;
    while (userXP >= getXPForLevel(level)) {
      level++;
    }
    return level - 1;
  };

  const handleStartAssessment = (index: number) => {
    if (skills[index].locked) return;

    const updatedSkills = [...skills];
    const skill = updatedSkills[index];

    // Increase progress
    skill.progress = Math.min(skill.progress + 20, 100);

    // Level up logic
    if (skill.progress === 100 && skill.level < skill.maxLevel) {
      skill.level += 1;
      skill.progress = 0;

      // Award XP for completing a skill level
      setUserXP((prevXP) => prevXP + 50);
    }

    setSkills(updatedSkills);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0e0e13] to-[#1a1a22] text-white">
      <Sidebar />

      <div className="flex-1 p-6 pl-20">
        {/* Header with User Info and Gamification Stats */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#252530] rounded-full px-4 py-2 shadow-md">
              <FireIcon className="mr-2 text-orange-500" />
              <span className="font-semibold">{streak} Day Streak</span>
            </div>
            <div className="flex items-center bg-[#252530] rounded-full px-4 py-2 shadow-md">
              <EmojiEventsIcon className="mr-2 text-yellow-500" />
              <span className="font-semibold">Level {getCurrentLevel()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src="/Jane-doe.png"
              alt="profile"
              height={80}
              width={80}
              className="rounded-full"
            />
            <div className="text-sm">John Doe</div>
          </div>
        </header>

        {/* XP Progress Bar */}
        <div className="bg-[#252530] rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span>XP: {userXP}</span>
            <span>Next Level: {getXPForLevel(getCurrentLevel() + 1)} XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-purple-600 h-4 rounded-full"
              style={{
                width: `${
                  ((userXP % 100) / getXPForLevel(getCurrentLevel() + 1)) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          {skills.map((skill: Skill, index: number) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-md transition-colors ${
                skill.locked
                  ? "bg-gray-800 opacity-70 cursor-not-allowed"
                  : "bg-[#252530] hover:bg-[#2a2a35]"
              }`}
            >
              {/* Progress Circle or Lock Icon */}
              <div className="relative w-12 h-12">
                {skill.locked ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <LockIcon className="text-gray-500" />
                  </div>
                ) : (
                  <>
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-700"
                        fill="none"
                        strokeWidth="3"
                        stroke="currentColor"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-purple-500"
                        fill="none"
                        strokeWidth="3"
                        strokeDasharray={`${skill.progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-white">{skill.level}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Skill Info */}
              <div className="flex-1">
                <p className="text-sm font-semibold">{skill.name}</p>
                <p
                  className={`text-xs ${
                    skill.locked
                      ? "text-gray-500"
                      : skill.difficulty === "Beginner"
                      ? "text-green-400"
                      : skill.difficulty === "Intermediate"
                      ? "text-blue-400"
                      : "text-red-400"
                  }`}
                >
                  {skill.locked
                    ? "Locked"
                    : `${skill.difficulty} | Level ${skill.level} of ${skill.maxLevel}`}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartAssessment(index)}
                disabled={skill.locked}
                className={`p-2 rounded-md flex items-center gap-1 ${
                  skill.locked
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : skill.progress === 100
                    ? "bg-green-500 text-white"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                } transition-colors`}
              >
                {skill.locked ? (
                  "Locked"
                ) : skill.progress === 100 ? (
                  <>
                    <CheckIcon className="w-4 h-4" /> Completed
                  </>
                ) : (
                  "Practice"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
