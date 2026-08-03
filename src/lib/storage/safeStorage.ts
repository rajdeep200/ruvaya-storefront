/** SSR-safe, try/catch-wrapped storage access — Safari private mode and SSR both throw or lack `window`. */
function getStorage(area: "local" | "session"): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return area === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage(key: string, area: "local" | "session" = "local"): string | null {
  const storage = getStorage(area);
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, area: "local" | "session" = "local"): void {
  const storage = getStorage(area);
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // Storage full or blocked — silently no-op rather than breaking the UI.
  }
}

export function removeStorage(key: string, area: "local" | "session" = "local"): void {
  const storage = getStorage(area);
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // no-op
  }
}
