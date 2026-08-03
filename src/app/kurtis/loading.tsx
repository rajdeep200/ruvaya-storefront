import { ProductGridSkeleton } from "@/components/common/skeletons/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-8 w-56 animate-pulse rounded bg-surface-muted" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-surface-muted" />
      <div className="mt-8">
        <div className="mb-8 h-11 animate-pulse rounded bg-surface-muted" />
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
