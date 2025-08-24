'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAutosave } from 'react-autosave';
import { dateFormatter, updateEntry } from '@/utils';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib';
import { titleFont } from '@/config';
import { Analysis } from '../ui/analysis/Analysis';

interface EditorProps {
  entry: Entry;
}

export const Editor = ({ entry }: EditorProps) => {
  const [value, setValue] = useState<string>(entry.content);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState(entry.aiAnalysis);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useAutosave({
    data: value,
    onSave: async (_value) => {
      if (_value === entry.content || isDeleting) return;
      setIsSaving(true);
      const data = await updateEntry(entry.id, _value);
      setAnalysis(data.aiAnalysis);
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const formattedDate = dateFormatter(entry.updatedAt);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4">
        <Link
          href="/journal"
          className="inline-flex items-center text-neutral-300 hover:text-violet-300 transition-colors mt-2 ml-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className={`${titleFont.className} text-sm`}>
            Back to Journal
          </span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow w-full">
        <section className="flex-grow lg:w-2/3 h-full">
          <div
            className={cn(
              'relative h-full bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-xl py-2 border transition-all duration-300',
              isFocused
                ? 'border-violet-400 shadow-[0_0_0_2px_rgba(167,139,250,0.3)]'
                : 'border-violet-500'
            )}
          >
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 bg-neutral-900 bg-opacity-70 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <h2
                className={`${titleFont.className} text-lg font-semibold text-violet-300`}
              >
                {formattedDate}
              </h2>
              <div className="flex items-center space-x-2">
                {isSaving && (
                  <div className="flex items-center text-violet-400">
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    <span className={`${titleFont.className} text-xs`}>
                      Saving...
                    </span>
                  </div>
                )}
                {!isSaving && (
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className={`${titleFont.className} text-xs`}>
                      Saved
                    </span>
                  </div>
                )}
              </div>
            </div>
            <textarea
              ref={textareaRef}
              className="w-full h-full pt-14 px-6 pb-6 text-base bg-transparent text-neutral-100 outline-none focus:outline-none resize-none"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </section>

        {/* Analysis */}
        <aside className="lg:w-1/3 h-full">
          <Analysis
            aiAnalysis={analysis!}
            entry={entry}
            setIsDeleting={setIsDeleting}
          />
        </aside>
      </div>
    </div>
  );
};
