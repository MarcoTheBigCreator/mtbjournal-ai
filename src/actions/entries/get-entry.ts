'use server';

import { prisma } from '@/utils';

export const getEntry = async (userId: string, entryId: string) => {
  try {
    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_id: {
          userId: userId,
          id: entryId,
        },
      },
      include: {
        aiAnalysis: true,
      },
    });

    if (!entry) {
      throw new Error(
        'Entry not found with the given id' + entryId + ' and userId' + userId
      );
    }

    return entry;
  } catch (error) {
    throw new Error('Unable to get entry' + error);
  }
};
