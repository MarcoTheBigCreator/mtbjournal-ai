interface Entry {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  aiAnalysis?: AiAnalysis | null;
}

interface AiAnalysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  journalEntryId: string;
  color: string;
  summary: string;
  subject: string;
  mood: string;
  negative: boolean;
  recommendation: string;
}
