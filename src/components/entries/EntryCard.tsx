import Link from 'next/link';
import { dateFormatter } from '@/utils';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';

interface EntryCardProps {
  entry: Entry;
}

export const EntryCard = ({ entry }: EntryCardProps) => {
  const { updatedAt } = entry;

  const formattedUpdatedDate = dateFormatter(updatedAt);

  return (
    <Link href={`/journal/${entry.id}`}>
      <Card className="flex flex-col h-full bg-neutral-700 bg-opacity-30 backdrop-blur-md hover:bg-opacity-50 transition-all duration-200 border-neutral-600">
        <CardHeader>
          <h3 className="text-lg font-semibold line-clamp-2 text-neutral-100">
            {entry.content}
          </h3>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-neutral-300">
            Mood:{' '}
            <span className="font-medium text-neutral-100 capitalize">
              {entry.aiAnalysis?.mood || 'N/A'}
            </span>
          </p>
        </CardContent>
        <CardFooter className="text-xs text-neutral-400">
          Last modified: {formattedUpdatedDate}
        </CardFooter>
      </Card>
    </Link>
  );
};
