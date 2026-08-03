export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-md bg-surface-muted" />
      <div className="mt-3 h-3.5 w-3/4 rounded bg-surface-muted" />
      <div className="mt-2 h-3.5 w-1/3 rounded bg-surface-muted" />
    </div>
  );
}
