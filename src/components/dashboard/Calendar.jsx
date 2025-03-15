import React from "react";
import { motion } from "framer-motion";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const Calendar = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = 15; // Example: Highlight 15th as today

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-light p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
        <CalendarTodayIcon className="text-primary-light" />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-gray-400 text-sm">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`p-1 rounded-full ${
              day === today ? "bg-primary text-white" : "text-gray-400"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Calendar;
