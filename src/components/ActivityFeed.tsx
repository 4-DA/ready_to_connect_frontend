"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Notifications as NotificationIcon,
  CheckCircle as BadgeIcon,
  EmojiEvents as AchievementIcon,
  LocalFireDepartment as StreakIcon,
  Star as XpIcon,
  Psychology as QuizIcon,
  MilitaryTech as LevelUpIcon,
  Assignment as ChallengeIcon,
} from "@mui/icons-material";
import api from "@/utils/api";
import { useGameStore } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  created_at_formatted: string;
  type: string;
  metadata: Record<string, any>;
}

export default function ActivityFeed() {
  const { isAuthenticated, token, isLoading, user } = useAuth();
  const { level, points, badges, lastUpdated } = useGameStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Enhanced check for logged in state that includes more fallbacks
  const userIsLoggedIn =
    (isAuthenticated && !!token && !isLoading) ||
    !!user ||
    points > 0 ||
    level > 0 ||
    badges.length > 0;

  const fetchNotifications = useCallback(async () => {
    console.log(
      "ActivityFeed - Fetching notifications, user logged in:",
      userIsLoggedIn
    );
    setHasAttemptedFetch(true);

    if (!userIsLoggedIn) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);

      // Ensure the Authorization header is set
      const storedToken = token || localStorage.getItem("access_token");
      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }

      const response = await api.get("/accounts/notifications/");
      console.log("ActivityFeed - Notifications response:", response.data);

      let fetchedNotifications: Notification[] = [];

      if (response.data && Array.isArray(response.data.results)) {
        fetchedNotifications = response.data.results.map((n: Notification) => ({
          ...n,
          id: n.id.toString(),
        }));
      } else if (Array.isArray(response.data)) {
        fetchedNotifications = response.data.map((n: Notification) => ({
          ...n,
          id: n.id.toString(),
        }));
      } else {
        console.warn(
          "Unexpected notifications response format:",
          response.data
        );
        fetchedNotifications = [];
      }

      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [userIsLoggedIn, token]);

  // Initial fetch and interval
  useEffect(() => {
    fetchNotifications();

    // Re-fetch every 30 seconds
    const interval = setInterval(() => {
      if (!isMarkingAllRead) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, isMarkingAllRead, fetchTrigger]);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthStateChanged = () => {
      console.log(
        "ActivityFeed: Auth state changed, retrying notification fetch"
      );
      // Use a trigger counter instead of directly calling to avoid dependency issues
      setFetchTrigger((prev) => prev + 1);
    };

    window.addEventListener("auth-state-changed", handleAuthStateChanged);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChanged);
    };
  }, []);

  // Listen for game data updates
  useEffect(() => {
    const handleGameDataUpdated = () => {
      console.log(
        "ActivityFeed: Game data updated, retrying notification fetch"
      );
      setFetchTrigger((prev) => prev + 1);
    };

    window.addEventListener("game-data-updated", handleGameDataUpdated);

    return () => {
      window.removeEventListener("game-data-updated", handleGameDataUpdated);
    };
  }, []);

  // Direct dependency on user changes
  useEffect(() => {
    if (user) {
      console.log(
        "ActivityFeed: User data updated, retrying notification fetch"
      );
      setFetchTrigger((prev) => prev + 1);
    }
  }, [user]);

  // Direct dependency on game data changes
  useEffect(() => {
    if (lastUpdated && points > 0) {
      console.log(
        "ActivityFeed: Game stats updated, retrying notification fetch"
      );
      setFetchTrigger((prev) => prev + 1);
    }
  }, [lastUpdated, points]);

  // Auto-retry if gamification updates happened
  useEffect(() => {
    if (
      userIsLoggedIn &&
      hasAttemptedFetch &&
      notifications.length === 0 &&
      (points > 0 || level > 0 || badges.length > 0)
    ) {
      console.log("ActivityFeed: Auto-retrying due to game data presence");
      fetchNotifications();
    }
  }, [
    points,
    level,
    badges.length,
    hasAttemptedFetch,
    notifications.length,
    fetchNotifications,
    userIsLoggedIn,
  ]);

  const markAsRead = async (id: string) => {
    try {
      const storedToken = token || localStorage.getItem("access_token");
      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }

      await api.post(`/accounts/notifications-viewset/${id}/mark_read/`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsMarkingAllRead(true);

      const storedToken = token || localStorage.getItem("access_token");
      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }

      if (notifications.length > 0) {
        await api.post("/accounts/notifications-viewset/mark_all_read/");
      }
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    const type = notification.type?.toLowerCase() || "";
    switch (type) {
      case "daily_xp_claimed":
        return <XpIcon className="text-purple-500" />;
      case "badge_earned":
        return <BadgeIcon className="text-yellow-500" />;
      case "streak_milestone":
        return <StreakIcon className="text-orange-500" />;
      case "level_up":
        return <LevelUpIcon className="text-green-500" />;
      case "challenge_completed":
        return <ChallengeIcon className="text-cyan-500" />;
      case "quiz_completed":
        return <QuizIcon className="text-teal-500" />;
      default:
        return <NotificationIcon className="text-purple-400" />;
    }
  };

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

  // Allow more time for loading if we're in initial auth state
  if (isLoading && !hasAttemptedFetch) {
    return (
      <div className="bg-[#1a1a22] rounded-lg p-6 text-white">
        <div className="flex items-center">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>
          Initializing authentication...
        </div>
      </div>
    );
  }

  // Don't show login prompt too early - we may still be initializing
  if (!userIsLoggedIn && hasAttemptedFetch && !loading) {
    return (
      <div className="bg-[#1a1a22] rounded-lg p-6">
        <h2 className="text-xl mb-4 flex items-center">
          <NotificationIcon className="mr-3 text-purple-400" />
          Recent Activity
        </h2>
        <div className="text-gray-400">
          Please log in to view your activity feed.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a22] rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl flex items-center">
          <NotificationIcon className="mr-3 text-purple-400" />
          Recent Activity
          {unreadCount > 0 && (
            <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount} new
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={isMarkingAllRead}
              className={`text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition ${
                isMarkingAllRead ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition"
          >
            {expanded ? "Show less" : "Show all"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400 flex items-center">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>
          Loading activities...
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-400">
          No activities yet. Complete challenges to see your progress!
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          <AnimatePresence>
            {notifications
              .slice(0, expanded ? notifications.length : 5)
              .map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  className={`flex gap-3 items-start rounded-lg p-3 transition-colors duration-300 group relative ${
                    notification.read
                      ? "bg-[#252530] hover:bg-[#2c2c3a]"
                      : "bg-[#2a2a38] hover:bg-[#33334a] border-l-2 border-purple-500"
                  }`}
                  onClick={() =>
                    !notification.read && markAsRead(notification.id)
                  }
                >
                  <div className="p-2 bg-[#1e1e23] rounded-lg">
                    {getNotificationIcon(notification)}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        notification.read
                          ? "text-white"
                          : "text-purple-300 font-medium"
                      } group-hover:text-purple-300 transition-colors`}
                    >
                      {notification.body}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.created_at_formatted}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!expanded && notifications.length > 5 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-4 w-full py-2 text-sm text-purple-400 hover:text-purple-300 bg-[#252530] hover:bg-[#2c2c3a] rounded-lg transition-colors"
        >
          Show {notifications.length - 5} more activities
        </button>
      )}
    </div>
  );
}
