import { z } from "zod";
import { imageAssetSchema, seoSchema } from "./common";
import { productListItemSchema } from "./product";

export const campaignStatusSchema = z.enum(["upcoming", "active", "expired"]);
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;

export const campaignSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  bannerImage: imageAssetSchema,
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  showCountdown: z.boolean().default(false),
  status: campaignStatusSchema,
  couponCode: z.string().optional(),
  terms: z.array(z.string()).default([]),
  seo: seoSchema.optional(),
  products: z.array(productListItemSchema).default([]),
});
export type Campaign = z.infer<typeof campaignSchema>;
