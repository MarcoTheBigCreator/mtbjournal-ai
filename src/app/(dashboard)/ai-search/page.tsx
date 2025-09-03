import { AiEntrySearch } from '@/components';
import { verifyAuth } from '@/helpers/auth-helpers';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI Search',
    description:
      'Welcome to your AI search page. Here you can explore your emotional journey and track your mental health.',
    applicationName: 'MTBJournal',
    metadataBase: new URL('https://mtbjournal.app/ai-search'),
    openGraph: {
      title: 'AI Search',
      description:
        'Welcome to your AI search page. Here you can explore your emotional journey and track your mental health.',
      url: 'https://mtbjournal.app/ai-search',
      siteName: 'MTBJournal',
      type: 'website',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756705973/Portfolio/mtbjournal-search_fkemkb.png`,
      ],
    },
    twitter: {
      title: 'AI Search',
      description:
        'Welcome to your AI search page. Here you can explore your emotional journey and track your mental health.',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756705973/Portfolio/mtbjournal-search_fkemkb.png`,
      ],
    },
  };
}

export default async function AiSearchPage() {
  await verifyAuth();

  return (
    <>
      <div className="flex-grow container mx-auto px-4 py-8">
        <AiEntrySearch />
      </div>
    </>
  );
}
