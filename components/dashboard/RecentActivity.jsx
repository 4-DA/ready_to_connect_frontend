import React from 'react';
import { motion } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';

const RecentActivity = ({ message, date }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-dark-lighter rounded-lg flex items-center space-x-4"
    >
      <NotificationsIcon className="text-primary-light" />
      <div>
        <p className="text-white">{message}</p>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>
    </motion.div>
  );
};

export default RecentActivity;
