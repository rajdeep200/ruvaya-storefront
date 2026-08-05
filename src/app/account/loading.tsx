export default function Loading() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-surface-muted" />
        <div className="h-3.5 w-40 rounded bg-surface-muted" />
      </div>
      <div className="mt-4 h-11 w-full rounded-md bg-surface-muted" />

      <div className="mt-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-surface-muted" />
        <div className="h-3.5 w-48 rounded bg-surface-muted" />
      </div>

      <div className="mt-8 space-y-4">
        <div className="h-11 w-full rounded-md bg-surface-muted" />
        <div className="h-11 w-full rounded-md bg-surface-muted" />
        <div className="h-11 w-32 rounded-md bg-surface-muted" />
      </div>
    </div>
  );
}
