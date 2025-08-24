import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions';
import { analyze, prisma } from '@/utils';

interface JournalRouteProps {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: JournalRouteProps) {
  const { content } = await request.json();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);

  try {
    const updatedEntry = await prisma.journalEntry.update({
      where: {
        userId_id: {
          userId: user.id,
          id: params.id,
        },
      },
      data: { content },
    });

    let updatedAiAnalysis;
    try {
      updatedAiAnalysis = await prisma.aiAnalysis.update({
        where: {
          journalEntryId: updatedEntry.id,
        },
        data: {
          ...(await analyze(updatedEntry.content)),
        },
      });
    } catch (analyzeError) {
      console.warn(
        `Error analyzing journal entry ${updatedEntry.id}:`,
        analyzeError
      );
      updatedAiAnalysis = null;
    }

    return NextResponse.json({
      data: { ...updatedEntry, aiAnalysis: updatedAiAnalysis },
    });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  } finally {
    revalidatePath('/journal', 'page');
    revalidatePath(`/journal/${params.id}`, 'page');
  }
}

export async function DELETE(request: Request, { params }: JournalRouteProps) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);

  try {
    await prisma.journalEntry.delete({
      where: {
        userId_id: {
          userId: user.id,
          id: params.id,
        },
      },
    });

    return NextResponse.json({
      data: `Entry with id ${params.id} deleted and user ${user.id}`,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  } finally {
    revalidatePath('/journal', 'page');
  }
}
