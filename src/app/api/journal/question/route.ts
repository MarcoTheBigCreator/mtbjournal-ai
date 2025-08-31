import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, askQuestionAboutEntries, questionSchema } from '@/utils';
import { verifyUser } from '@/helpers/server';

export async function POST(request: Request) {
  try {
    const user = await verifyUser();
    const { question } = await request.json();

    questionSchema.parse({ question });

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

    if (entries.length === 0) {
      return NextResponse.json({
        data: null,
        message: 'No journal entries found',
      });
    }

    const answer = await askQuestionAboutEntries(question, entries);

    revalidatePath('/journal', 'page');
    return NextResponse.json({ data: answer });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Question cannot be empty' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}
