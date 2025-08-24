'use client';

import { titleFont } from '@/config';
import { VanishInput } from '../ui/VanishInput';

export const AiEntrySearch = () => {
  const placeholders = [
    'How was my week?',
    'What did I learn today?',
    'What am I grateful for?',
    'What was my mood the last few days?',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
  };

  return (
    <>
      <h2
        className={`${titleFont.className} mb-10 text-xl text-center sm:text-4xl dark:text-white text-black`}
      >
        Ask your MTBJournal
      </h2>
      <VanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </>
  );
};
