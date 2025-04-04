"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";

export default function EventsCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Dynamic important dates (can be fetched from backend or passed as prop)
  const importantDates = useMemo(
    () => [
      { date: 15, type: "primary", description: "TechCorp Interview" },
      { date: 19, type: "secondary", description: "Team Meeting" },
      { date: 24, type: "primary", description: "Project Deadline" },
      { date: 29, type: "secondary", description: "Training Session" },
    ],
    []
  );

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const calendar = [];

    // Pad the beginning of the calendar with empty slots
    for (let i = 0; i < (firstDay + 6) % 7; i++) {
      calendar.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(i);
    }

    return { days, calendar };
  };

  const { days, calendar } = generateCalendarDays();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  interface DateVariant {
    scale?: number;
    backgroundColor?: string;
    color?: string;
    border?: string;
  }

  const getDateVariant = (date: number | null): DateVariant => {
    if (!date) return {};

    const importantDate = importantDates.find((d) => d.date === date);

    if (importantDate) {
      return {
        scale: 1.1,
        backgroundColor:
          importantDate.type === "primary" ? "#8E24AA" : "#9C27B0",
        color: "white",
      };
    }

    if (
      date === currentDay &&
      currentMonth === selectedMonth &&
      currentYear === selectedYear
    ) {
      return {
        border: "2px solid #4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
      };
    }

    return {};
  };

  interface ImportantDate {
    date: number;
    type: "primary" | "secondary";
    description: string;
  }

  const handleMonthChange = (direction: number): void => {
    setSelectedMonth((prev) => {
      let newMonth = prev + direction;
      let newYear = selectedYear;

      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }

      setSelectedYear(newYear);
      return newMonth;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a22] rounded-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMonthChange(-1)}
            className="text-gray-400 hover:text-white"
          >
            ◀
          </motion.button>
          <h2 className="text-xl">
            {new Date(selectedYear, selectedMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMonthChange(1)}
            className="text-gray-400 hover:text-white"
          >
            ▶
          </motion.button>
        </div>
        <CalendarIcon className="text-purple-400" />
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <div key={day} className="text-xs text-gray-400 py-1">
            {day}
          </div>
        ))}
        <AnimatePresence>
          {calendar.map((date, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: date ? 1 : 0,
                scale: date ? 1 : 0,
                pointerEvents: date ? "auto" : "none",
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={date ? { scale: 1.05 } : {}}
              className={`
                text-sm h-8 flex items-center justify-center rounded-full cursor-pointer
                ${date ? "hover:bg-gray-700" : "bg-transparent"}
                ${!date ? "invisible" : ""}
              `}
              style={date ? getDateVariant(date) : {}}
            >
              {date || ""}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Important Dates Legend */}
      <div className="mt-4 flex space-x-4 justify-center">
        {importantDates.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <div
              className={`
                w-3 h-3 rounded-full 
                ${event.type === "primary" ? "bg-purple-600" : "bg-purple-400"}
              `}
            />
            <span className="text-xs text-gray-300">{event.description}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
