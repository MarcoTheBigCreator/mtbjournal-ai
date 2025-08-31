'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/utils';
import { getUserByClerkId } from '../user/get-user-by-clerk-id';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getEntriesByUserIdPaginated = async ({
  page = 1,
  take = 11,
}: Omit<PaginationOptions, 'userId'>) => {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error('Unauthorized: User not authenticated');
  }

  const user = await getUserByClerkId(clerkUserId);

  if (isNaN(Number(page))) page = 1;
  if (isNaN(Number(take))) take = 11;
  if (page < 1) page = 1;

  try {
    const entries = await prisma.journalEntry.findMany({
      take,
      skip: (page - 1) * take,
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        aiAnalysis: true,
      },
    });

    const totalEntriesCount = await prisma.journalEntry.count({
      where: {
        userId: user.id,
      },
    });

    const totalPages = Math.ceil(totalEntriesCount / take);

    return {
      totalPages,
      entries,
    };
  } catch (error) {
    throw new Error('Error fetching entries' + error);
  }
};
