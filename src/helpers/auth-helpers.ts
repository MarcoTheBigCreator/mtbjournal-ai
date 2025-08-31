import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';

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
