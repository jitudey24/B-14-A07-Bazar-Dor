
type SkeletonProps = {
  className?: string;
};


export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  );
}

// Category page-er ekta product card (ProductList-er card-er motoi)
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-16" />
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

// Product grid (3 column max - ProductList-er grid-er motoi)
export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Pura category page (main wrapper shoho)
export function CategoryPageSkeleton() {
  return (
    <main className="bg-[#f3f8f4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header card */}
        <div className="mb-4 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>

        {/* Sort bar */}
        <div className="mb-4 flex items-center justify-end gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-40 rounded-lg" />
        </div>

        <Skeleton className="mb-3 h-3 w-40" />

        <ProductGridSkeleton count={9} />
      </div>
    </main>
  );
}

// Pura product details page (main wrapper shoho)
export function ProductDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        {/* Breadcrumb */}
        <Skeleton className="mb-4 h-4 w-56" />

        {/* Header card */}
        <section className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Skeleton className="h-28 w-40 rounded-xl" />
        </section>

        {/* Price summary */}
        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">
          <Skeleton className="mb-4 h-6 w-36" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </section>

        {/* Market table */}
        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">
          <Skeleton className="mb-4 h-6 w-48" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Skeleton;
