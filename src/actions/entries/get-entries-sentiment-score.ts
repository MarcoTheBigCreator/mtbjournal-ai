'use server';

import { prisma } from '@/utils';
import { getDbUser } from '@/helpers/server';
import { AiMoodData } from '@/types';

/**
 * Fetches the sentiment scores of AI analyses for the authenticated user's entries
 */
export async function getEntriesSentimentScore(): Promise<AiMoodData> {
  try {
    const { dbUser } = await getDbUser();

    const aiAnalyses = await prisma.aiAnalysis.findMany({
      where: {
        userId: dbUser.id,
      },
      select: {
        color: true,
        mood: true,
        sentimentScore: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Handle case when no analyses exist
    if (!aiAnalyses || aiAnalyses.length === 0) {
      const sentimentInformation = {
        averageSentimentScore: 0,
        totalNotes: 0,
        lastRecordedMood: 'No mood recorded yet',
        lastMoodColor: 'gray',
      };

      return { aiAnalyses: [], sentimentInformation };
    }

    const sumAnalysesSentimentScore = aiAnalyses.reduce(
      (acc, analysis) => acc + analysis.sentimentScore,
      0
    );

    const averageSentimentScore = Math.round(
      sumAnalysesSentimentScore / aiAnalyses.length
    );

    const totalNotes = aiAnalyses.length;
    const lastRecordedMood = aiAnalyses[totalNotes - 1].mood;
    const lastMoodColor = aiAnalyses[totalNotes - 1].color;

    const sentimentInformation = {
      averageSentimentScore,
      totalNotes,
      lastRecordedMood,
      lastMoodColor,
    };

    return { aiAnalyses, sentimentInformation };
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      throw new Error('Unauthorized: User not authenticated');
    }
    throw new Error(
      `Unable to get entry: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
