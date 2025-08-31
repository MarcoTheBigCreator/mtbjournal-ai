import { JournalEntry } from '@prisma/client';

const createUrl = (path: string) => {
  return window.location.origin + path;
};

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
