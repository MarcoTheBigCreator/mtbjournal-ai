import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Editor } from '@/components';
import { getEntry, getUserByClerkId } from '@/actions';

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

  const journalUser = await getUserByClerkId(userId);
  const journalUserId = journalUser.id;

  const entry = await getEntry(journalUserId, id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <Editor entry={entry} />
    </div>
  );
}
