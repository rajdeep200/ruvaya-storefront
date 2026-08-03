import { readStorage, writeStorage } from "@/lib/storage/safeStorage";

const KEY = "ruvaya-attribution";

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  affiliateCode?: string;
};

/** Last-touch attribution: overwritten whenever a new UTM/affiliate param arrives, kept otherwise. */
export function captureAttributionFromUrl(url: URL, referrer: string): Attribution {
  const params = url.searchParams;
  const hasUtm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"].some((k) =>
    params.has(k),
  );

  const existing = getStoredAttribution();
  if (!hasUtm) return existing;

  const next: Attribution = {
    utmSource: params.get("utm_source") ?? existing.utmSource,
    utmMedium: params.get("utm_medium") ?? existing.utmMedium,
    utmCampaign: params.get("utm_campaign") ?? existing.utmCampaign,
    utmContent: params.get("utm_content") ?? existing.utmContent,
    utmTerm: params.get("utm_term") ?? existing.utmTerm,
    affiliateCode: params.get("ref") ?? existing.affiliateCode,
    referrer: referrer || existing.referrer,
  };
  writeStorage(KEY, JSON.stringify(next), "local");
  return next;
}

export function getStoredAttribution(): Attribution {
  const raw = readStorage(KEY, "local");
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return {};
  }
}
