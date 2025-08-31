import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';
import { prisma, questionAndAnswer } from '@/utils';

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);

  const { question } = await request.json();

  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const answer = await questionAndAnswer(question, entries);

    return NextResponse.json({ data: answer });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  } finally {
    revalidatePath('/journal', 'page');
  }
}
