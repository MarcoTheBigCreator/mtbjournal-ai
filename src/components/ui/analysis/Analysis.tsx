'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib';
import { titleFont } from '@/config';
import { deleteEntry, getColorClasses } from '@/utils';
import styles from './Analysis.module.css';
import { Trash2 } from 'lucide-react';
import { Button } from '../Button';

interface AnalysisProps {
  aiAnalysis: AiAnalysis;
  entry: Entry;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Analysis = ({
  aiAnalysis,
  entry,
  setIsDeleting,
}: AnalysisProps) => {
  const router = useRouter();

  const { color, summary, subject, mood, negative, recommendation } =
    aiAnalysis;

  const analysisData = [
    { label: 'Summary', value: summary },
    { label: 'Subject', value: subject },
    { label: 'Mood', value: mood },
    { label: 'Negative', value: negative ? 'Yes' : 'No' },
    { label: 'Recommendations', value: recommendation },
  ];

  const { bg, text, border } = getColorClasses(color);

  const onDeleteEntry = async () => {
    setIsDeleting(true);
    await deleteEntry(entry.id);
    router.push(`/journal`);
    router.refresh();
  };

  return (
    <div
      className={cn(
        'bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-xl border overflow-hidden',
        border,
        styles[border]
      )}
    >
      <div
        className={cn(
          'px-6 py-4 bg-opacity-50 backdrop-blur-sm',
          bg,
          styles[bg]
        )}
      >
        <h2
          className={cn(
            titleFont.className,
            'text-2xl font-bold text-neutral-100'
          )}
        >
          Analysis
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {analysisData.map((data, index) => (
          <div
            key={data.label}
            className={cn(
              'pb-4',
              index !== analysisData.length - 1 &&
                'border-b border-violet-300 border-opacity-30'
            )}
          >
            <h3
              className={cn(
                titleFont.className,
                'text-lg font-semibold mb-2',
                text,
                styles[text]
              )}
            >
              {data.label}
            </h3>
            <p className="text-neutral-200">{data.value || 'N/A'}</p>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-violet-300 border-opacity-30">
        <Button
          onClick={onDeleteEntry}
          className={cn(
            'flex items-center justify-center w-full px-4 py-2',
            bg,
            styles[bg]
          )}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete Journal Entry
        </Button>
      </div>
    </div>
  );
};
