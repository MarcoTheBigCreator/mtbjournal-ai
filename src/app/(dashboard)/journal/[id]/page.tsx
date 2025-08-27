import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Editor } from '@/components';
import { getEntry } from '@/actions';

interface EntryPageProps {
  params: {
    id: string;
  };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { userId } = await auth();
  const { id } = params;

  if (!userId) {
    redirect('/sign-in');
  }

  const entry = await getEntry(id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <Editor entry={entry} />
    </div>
  );
}
