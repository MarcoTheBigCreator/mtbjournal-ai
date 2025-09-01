import { Editor } from '@/components';
import { getEntry } from '@/actions';
import { verifyAuth } from '@/helpers/auth-helpers';

interface EntryPageProps {
  params: Promise<{
    id: string;
  }>;
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
