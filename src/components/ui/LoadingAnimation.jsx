
import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-20">
      <motion.div
        className="w-4 h-4 bg-primary rounded-full mr-1"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="w-4 h-4 bg-primary rounded-full mr-1"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      <motion.div
        className="w-4 h-4 bg-primary rounded-full"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
      />
    </div>
  );
};

export default LoadingAnimation;
