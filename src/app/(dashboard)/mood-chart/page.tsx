import { getEntriesSentimentScore } from '@/actions/entries/get-entries-sentiment-score';
import { verifyAuth } from '@/helpers/auth-helpers';
import { MoodChart, MoodStats } from '@/components';
import { titleFont } from '@/config';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mood Chart',
    description:
      'Welcome to your mood chart. Here you can explore your emotional journey and track your mental health.',
    applicationName: 'MTBJournal',
    metadataBase: new URL('https://mtbjournal.app/mood-chart'),
    openGraph: {
      title: 'Mood Chart',
      description:
        'Welcome to your mood chart. Here you can explore your emotional journey and track your mental health.',
      url: 'https://mtbjournal.app/mood-chart',
      siteName: 'MTBJournal',
      type: 'website',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756705809/Portfolio/mtbjournal-chart_nbpvxe.png`,
      ],
    },
    twitter: {
      title: 'Mood Chart',
      description:
        'Welcome to your mood chart. Here you can explore your emotional journey and track your mental health.',
      images: [
        `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756705809/Portfolio/mtbjournal-chart_nbpvxe.png`,
      ],
    },
  };
}

export default async function AiMoodChartPage() {
  await verifyAuth();

  const { aiAnalyses, sentimentInformation } = await getEntriesSentimentScore();

  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2
          className={`${titleFont.className} text-xl sm:text-4xl mb-8 text-center`}
        >
          Mood Chart
        </h2>
        <p className="text-sm md:text-base text-center text-violet-400 m-3 mb-10">
          Explore your emotional journey over time. Discover sentiment trends,
          track your mental well-being, and understand how your moods evolve
        </p>
      </div>

      {/* Chart Section */}
      <div className="mb-8">
        <MoodChart data={aiAnalyses} />
      </div>

      {/* Stats Cards Section */}
      <MoodStats
        totalNotes={sentimentInformation.totalNotes}
        lastRecordedMood={sentimentInformation.lastRecordedMood}
        averageSentimentScore={sentimentInformation.averageSentimentScore}
        lastMoodColor={sentimentInformation.lastMoodColor}
      />
    </div>
  );
}
