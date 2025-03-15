import React from 'react';
import { motion } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';

const InternshipCard = ({ title, company, date }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-dark-lighter rounded-lg flex items-center space-x-4"
    >
      <WorkIcon className="text-primary-light" />
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-gray-400 text-sm">{company}</p>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>
    </motion.div>
  );
};

export default InternshipCard;
