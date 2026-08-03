"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttributionFromUrl } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/track";

function AnalyticsRouteListenerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = new URL(window.location.href);
    captureAttributionFromUrl(url, document.referrer);
    track("page_view", {});
  }, [pathname, searchParams]);

  return null;
}

/** Fires a `page_view` on every client-side navigation. Mounted once in the root layout. */
export function AnalyticsRouteListener() {
  return (
    <Suspense fallback={null}>
      <AnalyticsRouteListenerInner />
    </Suspense>
  );
}
