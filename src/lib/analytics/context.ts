import { getOrCreateSessionId, getOrCreateVisitorId } from "@/lib/storage/identity";
import { getStoredAttribution } from "./attribution";

export function getDeviceCategory(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function buildBaseEventFields() {
  const attribution = getStoredAttribution();
  return {
    timestamp: new Date().toISOString(),
    sessionId: getOrCreateSessionId(),
    visitorId: getOrCreateVisitorId(),
    pagePath: typeof window !== "undefined" ? window.location.pathname : "",
    deviceCategory: getDeviceCategory(),
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    utmContent: attribution.utmContent,
    utmTerm: attribution.utmTerm,
    referrer: attribution.referrer,
    affiliateCode: attribution.affiliateCode,
  };
}
