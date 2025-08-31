'use client';

import { motion } from 'framer-motion';

export const ShimmerPlaceholder = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-4 rounded bg-neutral-200 dark:bg-neutral-700"
          style={{ width: `${Math.random() * 40 + 60}%` }}
          animate={{
            opacity: [0.3, 1, 0.3],
            filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
