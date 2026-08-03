export type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal";
  }) => Promise<{ error?: { message: string }; redirect?: boolean; paymentDetails?: unknown }>;
};

declare global {
  interface Window {
    Cashfree?: (config: { mode: "sandbox" | "production" }) => CashfreeInstance;
  }
}

const SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

let sdkPromise: Promise<void> | null = null;

/**
 * Loaded via the official script-tag build rather than an npm package, so
 * the storefront doesn't carry a Cashfree dependency it can't verify against
 * a real sandbox account from this repo — see docs/cashfree-sandbox-checklist.md.
 */
export function loadCashfreeScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cashfree SDK can only load in the browser."));
  }
  if (window.Cashfree) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK")));
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.head.appendChild(script);
  });

  return sdkPromise;
}
