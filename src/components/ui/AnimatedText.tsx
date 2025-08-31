'use client';

import { motion } from 'framer-motion';

export const AnimatedText = ({ text }: { text: string }) => {
  return (
    <div className="text-sm font-medium">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block text-neutral-500 dark:text-neutral-400"
          animate={{
            opacity: [0.4, 1, 0.4],
            filter: ['brightness(0.8)', 'brightness(1.3)', 'brightness(0.8)'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
            repeatDelay: 1,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};
