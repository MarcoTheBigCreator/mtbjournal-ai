export interface Entry {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  aiAnalysis?: AiAnalysis | null;
}

export interface EntryAnalysis {
  color: string;
  summary: string;
  subject: string;
  mood: string;
  negative: boolean;
  recommendation: string;
  sentimentScore: number;
}

export interface AiAnalysis extends EntryAnalysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  journalEntryId: string;
}

export interface AiMoodData {
  aiAnalyses: {
    color: string;
    mood: string;
    sentimentScore: number;
    createdAt: Date;
  }[];
  sentimentInformation: {
    averageSentimentScore: number;
    totalNotes: number;
    lastRecordedMood: string;
    lastMoodColor: string;
  };
}
