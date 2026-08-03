export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="h-8 w-56 animate-pulse rounded bg-surface-muted" />
      <div className="mt-2 h-4 w-40 animate-pulse rounded bg-surface-muted" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded bg-surface-muted" />
          ))}
        </div>
        <div className="h-64 w-full animate-pulse rounded-md bg-surface-muted" />
      </div>
    </div>
  );
}
