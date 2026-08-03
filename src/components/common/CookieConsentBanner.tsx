"use client";

import { Button } from "@/components/ui/button";
import { useConsentStore } from "@/store/consent";

export function CookieConsentBanner() {
  const hasResponded = useConsentStore((s) => s.hasResponded);
  const acceptAll = useConsentStore((s) => s.acceptAll);
  const essentialOnly = useConsentStore((s) => s.essentialOnly);

  if (hasResponded) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          We use essential cookies to run Ruvaya, and optional analytics cookies to understand how you
          shop with us. Read our{" "}
          <a href="/privacy-policy" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button type="button" variant="secondary" onClick={essentialOnly} className="h-auto min-h-11 px-4">
            Essential only
          </Button>
          <Button type="button" onClick={acceptAll} className="h-auto min-h-11 px-5">
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
