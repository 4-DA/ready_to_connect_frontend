"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100); // Ensure between 0-100

  return (
    <div className="bg-[#1a1a22] p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-2">
        📊 Progress to Next Level
      </h3>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <motion.div
          className="bg-purple-500 h-4 rounded-full"
          style={{ width: `${safeProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <p className="text-sm text-gray-400 mt-2">
        {safeProgress.toFixed(1)}% Complete
      </p>
    </div>
  );
};

export default ProgressBar;
