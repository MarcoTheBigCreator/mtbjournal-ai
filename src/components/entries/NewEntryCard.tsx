'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewEntry } from '@/utils';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export const NewEntryCard = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleNewEntry = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const data = await createNewEntry();
      router.push(`/journal/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating new entry:', error);
      setIsCreating(false);
    }
  };

  return (
    <Card
      onClick={handleNewEntry}
      className={`flex cursor-pointer items-center justify-center h-full transition-all duration-200 border-violet-500 ${
        isCreating
          ? 'bg-violet-700/30 cursor-not-allowed opacity-50'
          : 'bg-violet-700/50 backdrop-blur-lg hover:bg-violet-700/40'
      }`}
    >
      <CardContent className="flex flex-col items-center p-6">
        {isCreating ? (
          <>
            <Loader2 className="w-12 h-12 mb-2 text-violet-300 animate-spin" />
            <p className="text-lg font-medium text-violet-100">Creating...</p>
          </>
        ) : (
          <>
            <PlusCircle className="w-12 h-12 mb-2 text-violet-300" />
            <p className="text-lg font-medium text-violet-100">New Entry</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
