'use client';

import { useState } from 'react';
import { titleFont } from '@/config';
import { VanishInput } from '../ui/VanishInput';
import { SEARCH_PLACEHOLDERS } from '../../constants/searchPlaceholders';
import { askQuestion } from '@/utils';
import AiResponseDisplay from './AiResponseDisplay';

export const AiEntrySearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const aiAnswer = await askQuestion(inputValue);
      if (!aiAnswer) {
        setAiResponse(null);
      } else {
        setAiResponse(aiAnswer.answer);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse(
        'Sorry, I encountered an error while processing your question. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h2
          className={`${titleFont.className} mb-10 text-xl text-center sm:text-4xl dark:text-white text-black`}
        >
          Ask your MTBJournal
        </h2>
        <VanishInput
          placeholders={SEARCH_PLACEHOLDERS}
          onChange={onChange}
          onSubmit={handleSubmit}
        />
      </div>

      <AiResponseDisplay response={aiResponse} isLoading={isLoading} />
    </div>
  );
};
