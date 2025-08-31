'use server';

import { prisma, paramsSchema } from '@/utils';
import { getDbUser } from '@/helpers/server';

export const getEntry = async (entryId: string) => {
  try {
    const { dbUser } = await getDbUser();

    // Simple validation
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
