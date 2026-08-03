declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta Conversions API events go through the backend (server-to-server),
 * not from here — this only mirrors browser-side Pixel events for the
 * standard client-side signal. No-op until <MarketingScripts> has loaded
 * fbq and the visitor has granted marketing consent.
 */
export function trackMetaPixelEvent(name: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}
