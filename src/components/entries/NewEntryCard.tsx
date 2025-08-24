'use client';

import { useRouter } from 'next/navigation';
import { createNewEntry } from '@/utils';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export const NewEntryCard = () => {
  const router = useRouter();

  const handleNewEntry = async () => {
    const data = await createNewEntry();
    router.push(`/journal/${data.id}`);
    router.refresh();
  };

  return (
    <Card
      onClick={handleNewEntry}
      className="flex cursor-pointer items-center justify-center h-full bg-violet-700 bg-opacity-20 backdrop-blur-lg hover:bg-opacity-30 transition-all duration-200 border-violet-500"
    >
      <CardContent className="flex flex-col items-center p-6">
        <PlusCircle className="w-12 h-12 mb-2 text-violet-300" />
        <p className="text-lg font-medium text-violet-100">New Entry</p>
      </CardContent>
    </Card>
  );
};
