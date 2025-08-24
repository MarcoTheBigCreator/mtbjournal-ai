import { Card } from '@/components';

export default function JorunalLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-52 bg-neutral-700 rounded-md mb-8 mx-auto animate-pulse" />
      <div className="h-4 w-64 bg-neutral-700 rounded-md mb-8 mx-auto animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card
            key={index}
            className="h-48 bg-neutral-700 bg-opacity-30 backdrop-blur-md border-neutral-600 animate-pulse"
          >
            <div className="h-4 bg-neutral-600 rounded w-3/4 mb-2 mt-6 mx-6" />
            <div className="h-4 bg-neutral-600 rounded w-1/2 mb-4 mx-6" />
            <div className="h-4 bg-neutral-600 rounded w-1/4 mt-auto mb-6 mx-6" />
          </Card>
        ))}
      </div>
      <div className="mt-14 h-10 w-48 bg-neutral-700 rounded-md mb-8 mx-auto animate-pulse justify-center flex" />
    </div>
  );
}
