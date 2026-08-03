declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** No-op if the gtag.js snippet (loaded by <MarketingScripts>) hasn't run yet or consent isn't granted. */
export function trackGa4Event(name: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
