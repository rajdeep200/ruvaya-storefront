"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[ruvaya] unhandled error", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <h1 className="font-serif text-2xl text-text-primary">Something went wrong</h1>
      <p className="mt-3 text-sm text-text-secondary">
        We hit an unexpected error loading this page. Your cart and saved items are safe. Please try again, or head
        back to the homepage.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={reset} className="h-auto min-h-11 px-6 py-3">
          Try Again
        </Button>
        <Link href="/" className="min-h-11 rounded-full border border-border px-6 py-3 text-sm font-medium text-text-primary hover:border-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
