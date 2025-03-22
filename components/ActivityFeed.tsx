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
    {
      id: "3",
      type: "notification",
      message: "New internship matches found",
      date: "3/12/2025",
    },
  ];

  // Icon mapping for different activity types
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "badge":
        return <BadgeIcon className="activity-icon-badge" />;
      case "calendar":
        return <CalendarIcon className="activity-icon-calendar" />;
      default:
        return <NotificationIcon className="activity-icon-notification" />;
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
    <div className="activity-feed-container glass">
      <h2 className="activity-feed-title">
        <NotificationIcon className="activity-feed-title-icon" />
        Recent Activity
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">
          No recent activity
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="activity-feed-list"
        >
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="activity-item"
              >
                <div className="activity-icon-container">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <p className="activity-date">{activity.date}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
