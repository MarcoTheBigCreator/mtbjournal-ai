import {
  COLOR_PROMPT,
  MOOD_PROMPT,
  NEGATIVE_PROMPT,
  RECOMMENDATION_PROMPT,
  SENTIMENT_SCORE_PROMPT,
  SUBJECT_PROMPT,
  SUMMARY_PROMPT,
} from '@/constants';
import { z } from 'zod';

export const aiOutputSchema = z.object({
  color: z.string().describe(COLOR_PROMPT),
  summary: z.string().describe(SUMMARY_PROMPT),
  subject: z.string().describe(SUBJECT_PROMPT),
  mood: z.string().describe(MOOD_PROMPT),
  negative: z.boolean().describe(NEGATIVE_PROMPT),
  recommendation: z.string().describe(RECOMMENDATION_PROMPT),
  sentimentScore: z.number().min(-10).max(10).describe(SENTIMENT_SCORE_PROMPT),
});
