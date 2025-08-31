import { AiAnalysis, AiAnswer } from '@/types';
import { JournalEntry } from '@prisma/client';

/**
 * Creates a full URL for the given path.
 * @param {string} path The path to append to the origin.
 * @returns {string} The full URL as a string.
 */
const createUrl = (path: string): string => {
  return window.location.origin + path;
};

/**
 * Updates an existing journal entry.
 * @param {string} id The ID of the journal entry to update.
 * @param {string} content The new content for the journal entry.
 * @returns {Promise<JournalEntry & { aiAnalysis?: AiAnalysis | null }>} The updated journal entry.
 */
export const updateEntry = async (
  id: string,
  content: string
): Promise<JournalEntry & { aiAnalysis?: AiAnalysis | null }> => {
  try {
    const res = await fetch(
      new Request(createUrl(`/api/journal/${id}`), {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      })
    );

    if (res.ok) {
      const data = await res.json();
      return {
        ...data.data,
        aiAnalysis: data.data.aiAnalysis ?? null,
      };
    } else {
      throw new Error('Failed to update journal entry');
    }
  } catch (error) {
    throw new Error('Unable to update entry: ' + error);
  }
};

/**
 * Creates a new journal entry.
 * @returns {Promise<JournalEntry>} The created journal entry.
 */
export const createNewEntry = async (): Promise<JournalEntry> => {
  try {
    const res = await fetch(
      new Request(createUrl('/api/journal'), {
        method: 'POST',
      })
    );

    if (!res.ok) {
      throw new Error('Unable to create new entry: ' + res.status);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Unable to create new entry: ' + error);
  }
};

/**
 * Deletes a journal entry.
 * @param {string} id The ID of the journal entry to delete.
 * @returns {Promise<{ data: string }>} The result of the delete operation.
 */
export const deleteEntry = async (id: string): Promise<{ data: string }> => {
  try {
    const res = await fetch(
      new Request(createUrl(`/api/journal/${id}`), {
        method: 'DELETE',
      })
    );

    if (!res.ok) {
      throw new Error('Failed to delete journal entry');
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Unable to delete entry: ' + error);
  }
};

/**
 * Asks a question to the AI.
 * @param {string} question The question to ask.
 * @returns {Promise<AiAnswer | null>} The AI's answer or null if not available.
 */
export const askQuestion = async (
  question: string
): Promise<AiAnswer | null> => {
  try {
    const res = await fetch(
      new Request(createUrl('/api/journal/question'), {
        method: 'POST',
        body: JSON.stringify({ question }),
      })
    );

    if (!res.ok) {
      throw new Error('Failed to get answer to the question');
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Unable to get answer: ' + error);
  }
};
