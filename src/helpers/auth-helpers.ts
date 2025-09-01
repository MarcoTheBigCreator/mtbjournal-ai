import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';
import { redirect } from 'next/navigation';

/**
 * Verifies the user's authentication status.
 * @returns {Promise} A promise that resolves if the user is authenticated.
 * @throws {Error} If the user is not authenticated.
 */
export async function verifyUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await getUserByClerkId(userId);
  return user;
}

/**
 * Verifies the user's authentication status
 * and redirects to the sign-in page if not authenticated.
 * @returns {Promise<void>} A promise that resolves if the user is authenticated.
 */
export async function verifyAuth(): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }
}
