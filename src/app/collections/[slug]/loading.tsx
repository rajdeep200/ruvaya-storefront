import { ProductGridSkeleton } from "@/components/common/skeletons/ProductGridSkeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-48 w-full animate-pulse bg-surface-muted sm:h-64" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="h-8 w-56 animate-pulse rounded bg-surface-muted" />
        <div className="mt-8">
          <div className="mb-8 h-11 animate-pulse rounded bg-surface-muted" />
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
