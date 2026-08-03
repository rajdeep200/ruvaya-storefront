import { env } from "@/config/env";
import { apiFetch } from "./client";
import { storefrontConfigSchema } from "@/lib/validation/storefrontConfig";
import { homepageResponseSchema } from "@/lib/validation/homepage";
import { mockDelay } from "@/lib/mock/delay";
import { mockStorefrontConfig } from "@/lib/mock/storefrontConfig";
import { mockHomepage } from "@/lib/mock/homepage";

export async function getStorefrontConfig() {
  if (env.useMockApi) {
    await mockDelay();
    return mockStorefrontConfig;
  }
  return apiFetch("/storefront/config", storefrontConfigSchema, {
    next: { tags: ["storefront-config"], revalidate: 300 },
  });
}

export async function getHomepage() {
  if (env.useMockApi) {
    await mockDelay();
    return mockHomepage;
  }
  return apiFetch("/storefront/homepage", homepageResponseSchema, {
    next: { tags: ["homepage"], revalidate: 300 },
  });
}
