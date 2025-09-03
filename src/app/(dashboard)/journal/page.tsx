import { getEntriesByUserIdPaginated } from '@/actions';
import { titleFont } from '@/config';
import { EntryGrid, Pagination } from '@/components';
import { verifyAuth } from '@/helpers/auth-helpers';
import { Metadata } from 'next';

interface JournalSearchParamsProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard',
    description:
      'Welcome to your journal dashboard. Here you can track your emotions and monitor your mental health.',
    applicationName: 'MTBJournal',
    metadataBase: new URL('https://mtbjournal.app/journal'),
    openGraph: {
      title: 'Dashboard',
      description:
        'Welcome to your journal dashboard. Here you can track your emotions and monitor your mental health.',
      url: 'https://mtbjournal.app/journal',
      siteName: 'MTBJournal',
      type: 'website',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756705651/Portfolio/mtbjournal-dashboard_i9nxgp.png`,
      ],
    },
    twitter: {
      title: 'Dashboard',
      description:
        'Welcome to your journal dashboard. Here you can track your emotions and monitor your mental health.',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756705651/Portfolio/mtbjournal-dashboard_i9nxgp.png`,
      ],
    },
  };
}

export default async function JournalPage({
  searchParams,
}: JournalSearchParamsProps) {
  await verifyAuth();

  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const { entries, totalPages } = await getEntriesByUserIdPaginated({
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
