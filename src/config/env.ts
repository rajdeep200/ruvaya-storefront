/**
 * Single read point for storefront environment configuration. Never read
 * `process.env.NEXT_PUBLIC_*` directly elsewhere — import from here so the
 * defaults and parsing logic live in exactly one place.
 */
function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  useMockApi: readBoolean(process.env.NEXT_PUBLIC_USE_MOCK_API, true),
  cashfreeMode: (process.env.NEXT_PUBLIC_CASHFREE_MODE ?? "sandbox") as "sandbox" | "production",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  enableMarketingAnalytics: readBoolean(process.env.NEXT_PUBLIC_ENABLE_MARKETING_ANALYTICS, false),
} as const;

/** Server-only secret. Never import `env.ts` usage of this into a "use client" module. */
export function getRevalidationSecret(): string {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    throw new Error("REVALIDATION_SECRET is not configured");
  }
  return secret;
}
