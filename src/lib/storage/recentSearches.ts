import { readStorage, writeStorage } from "./safeStorage";

const KEY = "ruvaya-recent-searches";
const MAX_ITEMS = 6;

export function getRecentSearches(): string[] {
  const raw = readStorage(KEY, "local");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return getRecentSearches();
  const next = [trimmed, ...getRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(
    0,
    MAX_ITEMS,
  );
  writeStorage(KEY, JSON.stringify(next), "local");
  return next;
}

export function clearRecentSearches(): void {
  writeStorage(KEY, JSON.stringify([]), "local");
}
