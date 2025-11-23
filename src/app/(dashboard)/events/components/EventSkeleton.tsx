/**
 * ============================================
 * EVENT SKELETON - LOADING STATE
 * ============================================
 * Skeleton component untuk loading state events
 */

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-120 bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

        {/* Category Badge Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Date Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>

        {/* Time Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>

        {/* Location Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>

        {/* Info Skeleton */}
        {/* <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div> */}
      </div>
    </div>
  );
}

export function EventsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
