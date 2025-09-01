import { AiEntrySearch } from '@/components';
import { verifyAuth } from '@/helpers/auth-helpers';

export default async function AiSearchPage() {
  await verifyAuth();

  return (
    <>
      <div className="flex-grow container mx-auto px-4 py-8">
        <AiEntrySearch />
      </div>
    </>
  );
}
