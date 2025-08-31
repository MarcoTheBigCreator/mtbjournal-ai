import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';

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

export async function getDbUser() {
  const clerkUser = await verifyUserServerAction();
  const dbUser = await getUserByClerkId(clerkUser.id);
  return { clerkUser, dbUser };
}
