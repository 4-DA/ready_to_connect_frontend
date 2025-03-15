import React from 'react';
import { motion } from 'framer-motion';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="fixed top-0 left-64 right-0 h-16 bg-dark-light flex items-center justify-end px-6 shadow-md z-10"
    >
      <div className="flex items-center space-x-3">
        <span className="text-white font-medium">John Doe</span>
        <AccountCircleIcon className="text-primary-light" fontSize="large" />
      </div>
    </motion.div>
  );
};

export default Header;
