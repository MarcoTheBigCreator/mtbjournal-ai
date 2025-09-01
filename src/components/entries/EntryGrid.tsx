import { Entry } from '@/types';
import { EntryCard } from './EntryCard';
import { NewEntryCard } from './NewEntryCard';

interface EntryGridProps {
  entries: Entry[];
}

export const EntryGrid = ({ entries }: EntryGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NewEntryCard />
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </>
  );
};
