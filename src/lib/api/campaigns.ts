import { z } from "zod";
import { env } from "@/config/env";
import { apiFetch } from "./client";
import { NotFoundApiError } from "./errors";
import { campaignSchema } from "@/lib/validation/campaign";
import { mockDelay } from "@/lib/mock/delay";
import { findMockCampaignBySlug, mockCampaigns } from "@/lib/mock/campaigns";

/** Non-expired campaigns only — used for the sitemap and any "active sales" listing. */
export async function getActiveCampaigns() {
  if (env.useMockApi) {
    await mockDelay();
    return mockCampaigns.filter((c) => c.status !== "expired");
  }
  return apiFetch("/campaigns", z.array(campaignSchema), {
    next: { tags: ["campaigns"], revalidate: 300 },
  });
}

export async function getCampaignBySlug(slug: string) {
  if (env.useMockApi) {
    await mockDelay();
    const campaign = findMockCampaignBySlug(slug);
    if (!campaign) throw new NotFoundApiError("We couldn't find this campaign.");
    return campaign;
  }
  return apiFetch(`/campaigns/${encodeURIComponent(slug)}`, campaignSchema, {
    next: { tags: ["campaigns", `campaign:${slug}`], revalidate: 120 },
  });
}
