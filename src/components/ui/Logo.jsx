
import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center justify-center mb-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
    >
      <div className="relative w-16 h-16">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary to-secondary-500 rounded-xl"
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          RC
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Logo;
