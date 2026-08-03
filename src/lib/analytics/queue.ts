import { env } from "@/config/env";
import { postAnalyticsEvents } from "@/lib/api/analytics";
import type { AnalyticsEvent } from "@/lib/validation/analytics";

const FLUSH_INTERVAL_MS = 2000;
const MAX_BATCH_SIZE = 20;

let buffer: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenersAttached = false;

function sendViaBeacon(events: AnalyticsEvent[]): boolean {
  if (typeof navigator === "undefined" || !("sendBeacon" in navigator) || !env.apiBaseUrl) return false;
  try {
    const blob = new Blob([JSON.stringify({ events })], { type: "application/json" });
    return navigator.sendBeacon(`${env.apiBaseUrl}/analytics/events`, blob);
  } catch {
    return false;
  }
}

function flush(useBeaconIfPossible = false): void {
  if (buffer.length === 0) return;
  const batch = buffer.slice(0, MAX_BATCH_SIZE);
  buffer = buffer.slice(MAX_BATCH_SIZE);

  const sentViaBeacon = useBeaconIfPossible && sendViaBeacon(batch);
  if (!sentViaBeacon) {
    void postAnalyticsEvents(batch);
  }

  if (buffer.length > 0) {
    scheduleFlush();
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush(false);
  }, FLUSH_INTERVAL_MS);
}

function attachLifecycleListeners(): void {
  if (listenersAttached || typeof document === "undefined") return;
  listenersAttached = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
  window.addEventListener("pagehide", () => flush(true));
}

/** Enqueue an event for the next batched, non-blocking flush. Never throws, never awaited by callers. */
export function enqueueAnalyticsEvent(event: AnalyticsEvent): void {
  attachLifecycleListeners();
  buffer.push(event);
  if (buffer.length >= MAX_BATCH_SIZE) {
    flush(false);
  } else {
    scheduleFlush();
  }
}
