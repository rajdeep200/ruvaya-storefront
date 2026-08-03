import { readStorage, writeStorage } from "./safeStorage";

const VISITOR_ID_KEY = "ruvaya-visitor-id";
const SESSION_ID_KEY = "ruvaya-session-id";
const SESSION_STARTED_AT_KEY = "ruvaya-session-started-at";
const SESSION_TTL_MS = 30 * 60 * 1000;

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Persists across visits — this is the anonymous visitor identity for analytics, never PII. */
export function getOrCreateVisitorId(): string {
  const existing = readStorage(VISITOR_ID_KEY, "local");
  if (existing) return existing;
  const id = generateId();
  writeStorage(VISITOR_ID_KEY, id, "local");
  return id;
}

/** Rolling 30-minute session window, stored in sessionStorage so a new tab still gets a fresh session. */
export function getOrCreateSessionId(): string {
  const startedAt = Number(readStorage(SESSION_STARTED_AT_KEY, "session") ?? 0);
  const isExpired = !startedAt || Date.now() - startedAt > SESSION_TTL_MS;

  if (isExpired) {
    const id = generateId();
    writeStorage(SESSION_ID_KEY, id, "session");
    writeStorage(SESSION_STARTED_AT_KEY, String(Date.now()), "session");
    return id;
  }

  writeStorage(SESSION_STARTED_AT_KEY, String(Date.now()), "session");
  return readStorage(SESSION_ID_KEY, "session") ?? generateId();
}
