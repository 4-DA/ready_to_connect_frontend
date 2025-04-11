"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Notifications as NotificationIcon,
  CheckCircle as BadgeIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import api from "@/utils/api"; // Centralized Axios instance

// Define the Activity type interface.
interface Activity {
  id: string;
  type: "notification" | "badge" | "calendar"; // Ensure backend returns a type field for each notification.
  message: string;
  date: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities from the backend.
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/accounts/notifications/");
      const data = response.data;
      // Assuming the backend returns an object with a "results" property.
      const fetchedActivities: Activity[] =
        data.results?.map((item: any) => ({
          id: item.id.toString(),
          type: item.type || "notification", // Fallback value.
          message: item.message || "New activity",
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "Unknown date",
        })) || [];
      setActivities(fetchedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and poll every 15 seconds.
  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 15000);
    return () => clearInterval(interval);
  }, [fetchActivities]);

  // Mapping function to choose icon per activity type.
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

  // Animation variants for container and items.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <div className="bg-[#1a1a22] rounded-lg p-6">
      <h2 className="text-xl mb-4 flex items-center">
        <NotificationIcon className="mr-3 text-purple-400" />
        Recent Activity
      </h2>

      {loading ? (
        <div className="text-gray-400">Loading activities...</div>
      ) : activities.length === 0 ? (
        <div className="text-gray-400">No activities yet</div>
      ) : (
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
                className="flex gap-3 items-start bg-[#252530] rounded-lg p-3 hover:bg-[#2c2c3a] transition-colors duration-300 group"
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
      )}
    </div>
  );
}
