import { getEntriesSentimentScore } from '@/actions/entries/get-entries-sentiment-score';
import { verifyAuth } from '@/helpers/auth-helpers';
import { MoodChart, MoodStats } from '@/components';
import { titleFont } from '@/config';

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
