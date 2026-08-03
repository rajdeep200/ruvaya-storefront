export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-8 w-64 animate-pulse rounded bg-surface-muted" />
      <div className="mt-6 h-20 w-full max-w-md animate-pulse rounded bg-surface-muted" />
      <div className="mt-10 space-y-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-28 w-full animate-pulse rounded bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
