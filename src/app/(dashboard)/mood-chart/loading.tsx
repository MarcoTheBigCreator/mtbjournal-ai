export default function AiMoodChartLoadingPage() {
  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="h-10 w-48 bg-neutral-700 rounded-md mb-8 mx-auto animate-pulse" />

        <div className="space-y-2 mb-10">
          <div className="h-4 w-80 bg-neutral-700 rounded-md mx-auto animate-pulse" />
        </div>
      </div>

      <div className="mb-8">
        <div className="h-96 w-full bg-neutral-700 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 animate-pulse">
          <div className="h-5 w-24 bg-neutral-700 rounded-md mb-4" />
          <div className="h-8 w-16 bg-neutral-700 rounded-md mb-2" />
          <div className="h-4 w-32 bg-neutral-700 rounded-md" />
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 animate-pulse">
          <div className="h-5 w-32 bg-neutral-700 rounded-md mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 bg-neutral-700 rounded-full" />
            <div className="h-8 w-20 bg-neutral-700 rounded-md" />
          </div>
          <div className="h-4 w-28 bg-neutral-700 rounded-md" />
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 animate-pulse">
          <div className="h-5 w-28 bg-neutral-700 rounded-md mb-4" />
          <div className="h-8 w-12 bg-neutral-700 rounded-md mb-2" />
          <div className="h-4 w-24 bg-neutral-700 rounded-md" />
        </div>
      </div>
    </div>
  );
}
