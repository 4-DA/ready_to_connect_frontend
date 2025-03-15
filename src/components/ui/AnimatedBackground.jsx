import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Purple glow in bottom right */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-primary-light/30 rounded-full filter blur-[100px] opacity-50"></div>
      
      {/* Dark purple glow in top left */}
      <div className="absolute top-0 left-0 w-[30vw] h-[30vw] bg-primary-dark/20 rounded-full filter blur-[80px] opacity-40"></div>
      
      {/* Animated wave pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-primary-light to-transparent"
            style={{ top: `${10 + index * 10}%` }}
            animate={{
              y: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyMTIxMjEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTYwIDEuNUEyOC41IDI4LjUgMCAwMDMxLjUgMzAgMjguNSAyOC41IDAgMDAzMCA1OC41IDI4LjUgMjguNSAwIDAwNTguNSAzMCAyOC41IDI4LjUgMCAwMDEuNSAzMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
    </div>
  );
};

export default AnimatedBackground;
