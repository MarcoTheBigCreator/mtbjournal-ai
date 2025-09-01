import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';

/**
 * Verifies the user's authentication status.
 * @returns {Promise} A promise that resolves if the user is authenticated.
 * @throws {Error} If the user is not authenticated.
 */
export async function verifyUserServerAction() {
  const user = await currentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  if (!user.emailAddresses?.[0]?.emailAddress) {
    throw new Error('User email is required');
  }

  return user;
}

/**
 * Retrieves the user from the database.
 * @returns {Promise} The clerk user and the database user.
 */
export async function getDbUser() {
  const clerkUser = await verifyUserServerAction();
  const dbUser = await getUserByClerkId(clerkUser.id);
  return { clerkUser, dbUser };
}
