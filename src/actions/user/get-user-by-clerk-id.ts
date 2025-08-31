'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/utils';

export const getUserByClerkId = async (userId?: string) => {
  const { userId: authUserId } = await auth();

  if (!authUserId) {
    throw new Error('Unauthorized: User not authenticated');
  }

  if (userId && userId !== authUserId) {
    throw new Error('Unauthorized: User ID mismatch');
  }

  const userIdToUse = userId || authUserId;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userIdToUse,
      },
    });

    return user;
  } catch (error) {
    throw new Error('Error fetching user' + error);
  }
};
