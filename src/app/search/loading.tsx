import { ProductGridSkeleton } from "@/components/common/skeletons/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-8 w-64 animate-pulse rounded bg-surface-muted" />
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
