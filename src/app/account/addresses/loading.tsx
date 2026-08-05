export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-surface-muted" />
            <div className="h-3.5 w-16 rounded bg-surface-muted" />
          </div>
          <div className="mt-3 h-4 w-32 rounded bg-surface-muted" />
          <div className="mt-3 h-3 w-full rounded bg-surface-muted" />
          <div className="mt-1.5 h-3 w-2/3 rounded bg-surface-muted" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 flex-1 rounded-md bg-surface-muted" />
            <div className="h-8 flex-1 rounded-md bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
