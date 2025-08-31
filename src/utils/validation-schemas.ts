import { z } from 'zod';

export const journalEntrySchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').trim(),
});

export const questionSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').trim(),
});

export const paramsSchema = z.object({
  id: z.string().uuid('Invalid entry ID format'),
});
