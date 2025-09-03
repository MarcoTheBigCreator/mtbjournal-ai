'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/utils';
import { verifyUserServerAction } from '@/helpers/server';

/**
 * Creates a new user in the database.
 * @returns {Promise<void>} A promise that resolves when the user is created.
 */
export const createNewUser = async (): Promise<void> => {
  try {
    const user = await verifyUserServerAction();

    console.log(
      'Creating new user with Clerk ID:',
      user.id,
      'and email:',
      user.emailAddresses[0].emailAddress
    );

    const match = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!match) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      redirect('/sign-in');
    }
    throw error;
  }
};
