import { z } from 'zod';

export const aiOutputSchema = z.object({
  color: z
    .string()
    .describe(
      'A color representing the mood of the journal entry. Choose one from this list: red, blue, green, yellow, purple, pink, indigo, gray, violet, orange, teal, cyan, lime, amber, emerald, fuchsia, rose, sky, slate. Use **color psychology** to assign the color based on the emotions expressed in the entry. For example, blue for sadness, red for anger or passion, yellow for happiness, green for calm or balance. Provide only one color, lowercase.'
    ),
  summary: z
    .string()
    .describe(
      'A medium-short-length summary of the journal entry in English. Capture the main events, key emotions, and context, enough to understand what happened and how the author felt. Capitalize the first letter of the first word.'
    ),
  subject: z
    .string()
    .describe(
      'The main subject or topic of the journal entry in English. Capitalize the first letter of the first word.'
    ),
  mood: z
    .string()
    .describe(
      'The overall mood of the author in English, expressed with one word and an emoji. Capitalize the first letter of the first word. Example: "Happy 😊".'
    ),
  negative: z
    .boolean()
    .describe(
      'Indicates if the journal entry contains negative emotions. True for negative, false otherwise.'
    ),
  recommendation: z
    .string()
    .describe(
      'A medium-short-length set of thoughtful recommendations in English to help the author cope with the situation. Include actionable advice and supportive guidance, reflecting the emotions and context described in the entry. Capitalize the first letter of the first word.'
    ),
});
