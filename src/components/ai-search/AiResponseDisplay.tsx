'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedText } from '../ui/AnimatedText';
import { ShimmerPlaceholder } from '../ui/ShimmerPlaceholder';

interface AiResponseDisplayProps {
  response: string | null;
  isLoading: boolean;
  className?: string;
}

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    setDisplayedText('');
    setCurrentIndex(0);

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex <= text.length) {
          setDisplayedText(text.slice(0, nextIndex));
          return nextIndex;
        } else {
          clearInterval(timer);
          return prevIndex;
        }
      });
    }, 10);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap"
    >
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-violet-500 ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default function AiResponseDisplay({
  response,
  isLoading,
  className,
}: AiResponseDisplayProps) {
  if (!isLoading && !response) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        'w-full max-w-4xl mx-auto p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700',
        'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
        'shadow-lg shadow-neutral-900/5 dark:shadow-black/20',
        'transition-colors duration-200',
        className
      )}
    >
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 mb-6">
            <AnimatedText text="MTBJournal is thinking..." />
          </div>
          <ShimmerPlaceholder />
        </motion.div>
      ) : response ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              MTBJournal Response
            </span>
          </div>
          <TypewriterText text={response} />
        </motion.div>
      ) : null}
    </motion.div>
  );
}
