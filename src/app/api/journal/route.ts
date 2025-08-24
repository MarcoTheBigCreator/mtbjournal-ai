import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';
import { prisma } from '@/utils';

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }

  const user = await getUserByClerkId(userId);

  try {
    const createdEntry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: `Start writing here about your day, your thoughts, your feelings, or anything else that comes to mind, Then the AI will analyze it and give you some insights. (It'll be automatically saved ) 📝`,
      },
    });

    await prisma.aiAnalysis.create({
      data: {
        userId: user.id,
        journalEntryId: createdEntry.id,
      },
    });

    return NextResponse.json({ data: createdEntry });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  } finally {
    revalidatePath('/journal', 'page');
  }
}
