import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/utils';
import { verifyUser } from '@/helpers/server';

/**
 * Handles the POST request for creating a journal entry.
 * @returns A promise that resolves to the response object.
 */
export async function POST() {
  try {
    const user = await verifyUser();

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

    revalidatePath('/journal', 'page');
    return NextResponse.json({ data: createdEntry });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}
