import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  analyzeJournalEntry,
  prisma,
  journalEntrySchema,
  paramsSchema,
} from '@/utils';
import { verifyUser } from '@/helpers/server';

interface JournalRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, { params }: JournalRouteProps) {
  const resolvedParams = await params;

  try {
    const user = await verifyUser();
    const { content } = await request.json();

    journalEntrySchema.parse({ content });
    paramsSchema.parse(resolvedParams);

    const updatedEntry = await prisma.journalEntry.update({
      where: {
        userId_id: {
          userId: user.id,
          id: resolvedParams.id,
        },
      },
      data: { content },
    });

    let updatedAiAnalysis;
    try {
      const analysisResult = await analyzeJournalEntry(updatedEntry.content);
      if (analysisResult) {
        updatedAiAnalysis = await prisma.aiAnalysis.update({
          where: {
            journalEntryId: updatedEntry.id,
          },
          data: analysisResult,
        });
      }
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
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  } finally {
    revalidatePath('/journal', 'page');
    revalidatePath(`/journal/${resolvedParams.id}`, 'page');
  }
}

export async function DELETE(request: Request, { params }: JournalRouteProps) {
  try {
    const user = await verifyUser();
    const resolvedParams = await params;

    paramsSchema.parse(resolvedParams);

    await prisma.journalEntry.delete({
      where: {
        userId_id: {
          userId: user.id,
          id: resolvedParams.id,
        },
      },
    });

    revalidatePath('/journal', 'page');
    return NextResponse.json({
      data: `Entry with id ${resolvedParams.id} deleted successfully`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
