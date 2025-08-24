export default function JournalIdLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full animate-pulse">
      <div className="flex-grow lg:w-2/3">
        <div className="relative h-full bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-violet-500 overflow-hidden">
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 bg-neutral-900 bg-opacity-70 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <div className="h-6 w-32 bg-violet-300 rounded"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-violet-400 rounded-full animate-pulse"></div>
              <div className="h-4 w-16 bg-violet-400 rounded"></div>
            </div>
          </div>
          <div className="w-full h-full pt-14 px-6 pb-6">
            <div className="h-4 bg-neutral-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-neutral-700 rounded w-full mb-4"></div>
            <div className="h-4 bg-neutral-700 rounded w-5/6 mb-4"></div>
            <div className="h-4 bg-neutral-700 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
      <div className="lg:w-1/3">
        <div className="bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-neutral-500 overflow-hidden">
          <div className="bg-neutral-700 bg-opacity-50 px-6 py-4">
            <div className="h-8 w-24 bg-neutral-300 rounded"></div>
          </div>
          <div className="p-6 space-y-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="pb-4 border-b border-neutral-300 border-opacity-30"
              >
                <div className="h-5 w-24 bg-neutral-300 rounded mb-2"></div>
                <div className="h-4 bg-neutral-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
