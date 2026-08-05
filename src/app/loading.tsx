// Root-level fallback — Next.js nests this Suspense boundary around every
// route below that doesn't define its own more specific loading.tsx, so this
// single file gives instant feedback on navigations that would otherwise
// render blank while the server responds (see AGENTS.md's Next.js gotchas).
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
