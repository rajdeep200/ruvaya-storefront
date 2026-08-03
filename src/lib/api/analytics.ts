import { env } from "@/config/env";
import { apiFetch } from "./client";
import { z } from "zod";
import type { AnalyticsEvent } from "@/lib/validation/analytics";

const analyticsAckSchema = z.object({ accepted: z.number().int().nonnegative() });

/**
 * Raw transport to POST /analytics/events. The queueing, batching,
 * sendBeacon fallback and consent gating live in `lib/analytics/` — this
 * function only knows how to send a batch and never blocks the caller on
 * failure (analytics must never break the purchasing flow).
 */
export async function postAnalyticsEvents(events: AnalyticsEvent[]): Promise<void> {
  if (events.length === 0) return;

  if (env.useMockApi) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[mock analytics]", events);
    }
    return;
  }

  try {
    await apiFetch("/analytics/events", analyticsAckSchema, {
      method: "POST",
      body: { events },
    });
  } catch {
    // Analytics failures are swallowed here; the caller's queue already
    // decides whether to retry on the next flush.
  }
}
