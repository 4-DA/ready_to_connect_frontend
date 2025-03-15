import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={\`p-4 rounded-lg shadow-lg \${gradient} text-white flex-1 min-w-[150px]\`}
    >
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </motion.div>
  );
};

export default StatsCard;
