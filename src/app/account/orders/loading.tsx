export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="h-14 w-12 shrink-0 rounded-md bg-surface-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/2 rounded bg-surface-muted" />
            <div className="h-3 w-1/3 rounded bg-surface-muted" />
          </div>
          <div className="h-6 w-20 shrink-0 rounded-full bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}
