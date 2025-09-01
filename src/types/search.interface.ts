export interface AiAnswer {
  answer: string;
  sources: AiSource[];
}

export interface AiSource {
  id: string;
  updatedAt: Date;
}

export interface EntrySource {
  id: string;
  content: string;
  updatedAt: Date;
}
