"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Notifications as NotificationIcon,
  CheckCircle as BadgeIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

// Define activity type
interface Activity {
  id: string;
  type: "notification" | "badge" | "calendar";
  message: string;
  date: string;
}

export default function ActivityFeed() {
  // Mock activities (replace with dynamic data source)
  const activities: Activity[] = [
    {
      id: "1",
      type: "badge",
      message: "You earned a new badge!",
      date: "3/14/2025",
    },
    {
      id: "2",
      type: "calendar",
      message: "Interview scheduled with TechCorp",
      date: "3/13/2025",
    },
  ];

  // Icon mapping for different activity types
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "badge":
        return <BadgeIcon className="text-yellow-500" />;
      case "calendar":
        return <CalendarIcon className="text-green-500" />;
      default:
        return <NotificationIcon className="text-purple-400" />;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="bg-[#1a1a22] rounded-lg p-6">
      <h2 className="text-xl mb-4 flex items-center">
        <NotificationIcon className="mr-3 text-purple-400" />
        Recent Activity
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4"
      >
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              className="flex gap-3 items-start bg-[#252530] rounded-lg p-3 
                hover:bg-[#2c2c3a] transition-colors duration-300 group"
            >
              <div className="p-2 bg-[#1e1e23] rounded-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white group-hover:text-purple-300 transition-colors">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
