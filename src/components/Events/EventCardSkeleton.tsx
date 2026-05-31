function EventCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative aspect-video rounded-2xl bg-gray-100 animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-md w-1/2 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-md w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default EventCardSkeleton;