export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mx-auto h-3 w-16 rounded bg-surface-muted" />
        <div className="mx-auto mt-2 h-6 w-40 rounded bg-surface-muted" />
        <div className="mx-auto mt-2 h-3 w-32 rounded bg-surface-muted" />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="h-6 w-40 rounded bg-surface-muted" />
        <div className="mt-6 flex flex-col gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-11 w-11 shrink-0 rounded-full bg-surface-muted" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3.5 w-32 rounded bg-surface-muted" />
                <div className="h-3 w-24 rounded bg-surface-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="h-4 w-20 rounded bg-surface-muted" />
        <div className="mt-4 h-16 w-full rounded-md bg-surface-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="h-full w-full rounded-md bg-surface-muted" />
        </div>
        <div className="h-32 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="h-full w-full rounded-md bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}
