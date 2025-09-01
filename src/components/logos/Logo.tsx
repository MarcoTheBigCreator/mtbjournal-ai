'use client';

import Link from 'next/link';
import { titleFont } from '@/config';
import { motion } from 'framer-motion';
import { Icons } from '../icons';

export const LogoWithText = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-xl text-white py-1 relative z-20"
    >
      <Icons.Logo className="h-[1.85rem] w-[1.85rem] pr-1 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${titleFont.className}`}
      >
        MTBJournal
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-3xl text-white py-1 relative z-20"
    >
      <Icons.Logo className="h-[1.85rem] w-[1.85rem] justify-start pr-1 flex-shrink-0" />
    </Link>
  );
};
