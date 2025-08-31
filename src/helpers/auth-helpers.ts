import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';

export async function verifyUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await getUserByClerkId(userId);
  return user;
}
