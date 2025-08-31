'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/utils';
import { User } from '@prisma/client';

/**
 * Retrieves a user by their Clerk ID.
 * @param {string} userId The Clerk ID of the user.
 * @returns {Promise<User>} The user object, or null if not found.
 */
export const getUserByClerkId = async (userId?: string): Promise<User> => {
  try {
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      throw new Error('Unauthorized: User not authenticated');
    }

    if (userId && userId !== authUserId) {
      throw new Error('Unauthorized: User ID mismatch');
    }

    const userIdToUse = userId || authUserId;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userIdToUse,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      throw error;
    }
    throw new Error(
      `Error fetching user: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};
