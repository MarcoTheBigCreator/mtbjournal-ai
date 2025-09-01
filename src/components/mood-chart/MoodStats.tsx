import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface MoodStatsProps {
  totalNotes: number;
  lastRecordedMood: string | null;
  averageSentimentScore: number;
  lastMoodColor?: string;
}

export const MoodStats = ({
  totalNotes,
  lastRecordedMood,
  averageSentimentScore,
  lastMoodColor = '#a855f7',
}: MoodStatsProps) => {
  const getSentimentLabel = (score: number): string => {
    if (score >= 7) return 'Very Positive';
    if (score >= 3) return 'Positive';
    if (score >= -2) return 'Neutral';
    if (score >= -6) return 'Negative';
    return 'Very Negative';
  };

  const getSentimentColor = (score: number): string => {
    if (score >= 7) return 'text-green-400';
    if (score >= 3) return 'text-green-300';
    if (score >= -2) return 'text-yellow-400';
    if (score >= -6) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Total Notes Card */}
      <Card glowEffect className="bg-neutral-800 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-neutral-200">
            Total Written
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-violet-400">{totalNotes}</div>
          <p className="text-sm text-neutral-400 mt-1">
            journal {totalNotes === 1 ? 'entry' : 'entries'} written
          </p>
        </CardContent>
      </Card>

      {/* Last Recorded Mood Card */}
      <Card glowEffect className="bg-neutral-800 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-neutral-200">
            Last Recorded Mood
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lastRecordedMood ? (
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: lastMoodColor }}
              />
              <div className="text-2xl font-bold text-white capitalize">
                {lastRecordedMood}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-neutral-400">
              No mood recorded
            </div>
          )}
          <p className="text-sm text-neutral-400 mt-1">
            {lastRecordedMood
              ? 'most recent entry'
              : 'start journaling to track mood'}
          </p>
        </CardContent>
      </Card>

      {/* Average Sentiment Score Card */}
      <Card glowEffect className="bg-neutral-800 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-neutral-200">
            Average Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${getSentimentColor(
              averageSentimentScore
            )}`}
          >
            {averageSentimentScore > 0 ? '+' : ''}
            {averageSentimentScore}
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            {getSentimentLabel(averageSentimentScore).toLowerCase()} overall
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
