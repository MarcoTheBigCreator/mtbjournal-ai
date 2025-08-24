import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getEntriesByUserIdPaginated, getUserByClerkId } from '@/actions';
import { titleFont } from '@/config';
import { EntryGrid, Pagination } from '@/components';

interface JournalSearchParamsProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function JournalPage({
  searchParams,
}: JournalSearchParamsProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const user = await getUserByClerkId(userId);

  const { entries, totalPages } = await getEntriesByUserIdPaginated({
    userId: user.id,
    page,
  });

  return (
    <>
      <div className="flex-grow container mx-auto px-4 py-8">
        <h2
          className={`${titleFont.className} text-xl sm:text-4xl mb-8 text-center`}
        >
          Journal
        </h2>
        <p className="text-sm md:text-base text-center text-violet-400 m-3 mb-10">
          Track your emotions, monitor your mental health, and start a new
          journal or view past entries.
        </p>
        <EntryGrid entries={entries} />
      </div>
      <div className="mt-auto">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
