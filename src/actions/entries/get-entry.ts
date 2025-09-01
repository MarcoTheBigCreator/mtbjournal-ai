'use server';

import { prisma, paramsSchema } from '@/utils';
import { getDbUser } from '@/helpers/server';
import { Entry } from '@/types';

/**
 * Retrieves a journal entry by its ID.
 * @param {string} entryId The ID of the journal entry.
 * @returns {Promise<Entry>} The journal entry, or null if not found.
 */
export const getEntry = async (entryId: string): Promise<Entry> => {
  try {
    const { dbUser } = await getDbUser();

    paramsSchema.parse({ id: entryId });

    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_id: {
          userId: dbUser.id,
          id: entryId,
        },
      },
      include: {
        aiAnalysis: true,
      },
    });

    if (!entry) {
      throw new Error(`Entry not found with id: ${entryId}`);
    }

    return entry;
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      throw new Error('Unauthorized: User not authenticated');
    }
    if (error instanceof Error && error.name === 'ZodError') {
      throw new Error('Invalid entry ID format');
    }
    throw new Error(
      `Unable to get entry: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};
