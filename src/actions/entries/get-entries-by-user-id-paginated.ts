'use server';

import { prisma } from '@/utils';

interface PaginationOptions {
  page?: number;
  take?: number;
  userId: string;
}

export const getEntriesByUserIdPaginated = async ({
  page = 1,
  take = 11,
  userId,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (isNaN(Number(take))) take = 11;
  if (page < 1) page = 1;

  try {
    // Get entries by user id
    const entries = await prisma.journalEntry.findMany({
      take,
      skip: (page - 1) * take,
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        aiAnalysis: true,
      },
    });

    // Get total entries count
    const totalEntriesCount = await prisma.journalEntry.count({
      where: {
        userId,
      },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalEntriesCount / take);

    // Return total pages and entries
    return {
      totalPages,
      entries,
    };
  } catch (error) {
    throw new Error('Error fetching entries' + error);
  }
};
