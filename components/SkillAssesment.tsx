'use client';

import { useState } from 'react';
import { Star as StarIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import Image from 'next/image';
import Sidebar from './Sidebar';

// Define the type for a single skill
interface Skill {
  name: string;
  level: number;
  maxLevel: number;
  progress: number; // Percentage (0-100)
  completed: boolean;
}

export default function SkillAssessments() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      name: 'Coding Fundamentals',
      level: 3,
      maxLevel: 5,
      progress: 60,
      completed: false,
    },
    {
      name: 'Problem Solving',
      level: 2,
      maxLevel: 5,
      progress: 85,
      completed: false,
    },
    {
      name: 'Communication Skills',
      level: 4,
      maxLevel: 5,
      progress: 20,
      completed: false,
    },
  ]);

  const handleStartAssessment = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills[index].progress = Math.min(updatedSkills[index].progress + 20, 100);
    if (updatedSkills[index].progress === 100 && updatedSkills[index].level < updatedSkills[index].maxLevel) {
      updatedSkills[index].level += 1;
      updatedSkills[index].progress = 0;
    }
    setSkills(updatedSkills);
  };

  return ( 
    <div className="flex min-h-screen bg-[#0e0e13] text-white">  
     <Sidebar/>

<div className="flex-1 p-6 pl-20">
  <header className="flex justify-between items-center mb-6">
    {/* Search input field */}
    <input
      type="text"
      placeholder="Search..."
      className="px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white focus:outline-none"
    />
    <div className="flex items-center gap-4">
      {/* Circular image next to John Doe */} 

      <Image
      src="/Jane-doe.png" 
      alt="profile" 
      height={80} 
      width ={80} 
      className="rounded-full"
      />
      <div className="text-sm">John Doe</div>
    </div>
  </header>
     

      {/* Skills List */}
      <div className="space-y-4">
        {skills.map((skill: Skill, index: number) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 bg-[#252530] rounded-md hover:bg-[#2a2a35] transition-colors"
          >
            {/* Progress Circle */}
            <div className="relative w-12 h-12">
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
            </div>

            {/* Skill Info */}
            <div className="flex-1">
              <p className="text-sm font-semibold">{skill.name}</p>
              <p className="text-xs text-gray-400">
                Level {skill.level} of {skill.maxLevel}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleStartAssessment(index)}
              className={`p-2 rounded-md flex items-center gap-1 ${
                skill.progress === 100
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              } transition-colors`}
            >
              {skill.progress === 100 ? (
                <>
                  <CheckIcon className="w-4 h-4" /> Completed
                </>
              ) : (
                'Practice'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>

    </div>
   
  );
}