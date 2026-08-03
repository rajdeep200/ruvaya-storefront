export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-surface-muted" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse rounded-md bg-surface-muted" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-surface-muted" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-surface-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-surface-muted" />
          <div className="h-12 w-full animate-pulse rounded bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}
