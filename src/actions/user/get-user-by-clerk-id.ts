'use server';

import { prisma } from '@/utils';

export const getUserByClerkId = async (userId: string) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userId,
      },
    });

    return user;
  } catch (error) {
    throw new Error('Error fetching user' + error);
  }
};
