'use server';

import { prisma, paginationSchema } from '@/utils';
import { getDbUser } from '@/helpers/server';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getEntriesByUserIdPaginated = async ({
  page = 1,
  take = 11,
}: Omit<PaginationOptions, 'userId'>) => {
  try {
    const { dbUser } = await getDbUser();

    const validatedParams = paginationSchema.parse({ page, take });

    const entries = await prisma.journalEntry.findMany({
      take: validatedParams.take,
      skip: (validatedParams.page - 1) * validatedParams.take,
      where: {
        userId: dbUser.id,
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
        userId: dbUser.id,
      },
    });

    const totalPages = Math.ceil(totalEntriesCount / validatedParams.take);

    return {
      totalPages,
      entries,
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      throw new Error('Unauthorized: User not authenticated');
    }
    throw new Error(
      `Error fetching entries: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};
