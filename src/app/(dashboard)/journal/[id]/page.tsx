import { Editor } from '@/components';
import { getEntry } from '@/actions';
import { verifyAuth } from '@/helpers/auth-helpers';
import { Metadata } from 'next';

interface EntryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EntryPageProps): Promise<Metadata> {
  const { id } = await params;

  const entry = await getEntry(id);

  return {
    title: entry?.aiAnalysis?.subject ?? 'N/A',
    description: entry?.aiAnalysis?.summary ?? 'N/A',
    openGraph: {
      title: entry?.aiAnalysis?.subject ?? 'N/A',
      description: entry?.aiAnalysis?.summary ?? 'N/A',
    },
  };
}

export default async function EntryPage({ params }: EntryPageProps) {
  await verifyAuth();

  const { id } = await params;

  const entry = await getEntry(id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <Editor entry={entry} />
    </div>
  );
}
