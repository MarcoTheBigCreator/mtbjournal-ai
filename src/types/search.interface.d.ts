interface AiAnswer {
  answer: string;
  sources: AiSource[];
}

interface AiSource {
  id: string;
  updatedAt: Date;
}

interface EntrySource {
  id: string;
  content: string;
  updatedAt: Date;
}
