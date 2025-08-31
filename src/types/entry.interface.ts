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
}

export interface AiAnalysis extends EntryAnalysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  journalEntryId: string;
}
