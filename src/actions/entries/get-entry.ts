'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/utils';
import { getUserByClerkId } from '../user/get-user-by-clerk-id';

export const getEntry = async (entryId: string) => {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error('Unauthorized: User not authenticated');
  }

  const user = await getUserByClerkId(clerkUserId);

  try {
    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_id: {
          userId: user.id,
          id: entryId,
        },
      },
      include: {
        aiAnalysis: true,
      },
    });

    if (!entry) {
      throw new Error(
        'Entry not found with the given id' + entryId + ' and userId' + user.id
      );
    }

    return entry;
  } catch (error) {
    throw new Error('Unable to get entry' + error);
  }
};
