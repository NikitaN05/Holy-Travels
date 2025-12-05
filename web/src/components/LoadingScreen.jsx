import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-saffron-50 to-primary-100 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-saffron-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-4xl">🙏</span>
        </motion.div>
        
        {/* Brand Name */}
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-2">
          Holy Travels
        </h1>
        
        {/* Loading Text */}
        <p className="text-gray-600 mb-6">Sacred Journeys, Divine Experiences</p>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 rounded-full bg-saffron-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

