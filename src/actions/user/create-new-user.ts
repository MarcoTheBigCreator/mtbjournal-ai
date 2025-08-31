'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/utils';
import { verifyUserServerAction } from '@/helpers/server';

export const createNewUser = async () => {
  try {
    const user = await verifyUserServerAction();

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
