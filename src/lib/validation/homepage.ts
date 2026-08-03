import { z } from "zod";
import { imageAssetSchema, videoAssetSchema } from "./common";
import { collectionSummarySchema } from "./collection";
import { productListItemSchema } from "./product";

export const heroSectionSchema = z.object({
  heading: z.string(),
  subheading: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  image: imageAssetSchema,
  video: videoAssetSchema.optional(),
});
export type HeroSection = z.infer<typeof heroSectionSchema>;

export const seasonalCampaignBannerSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  image: imageAssetSchema,
});
export type SeasonalCampaignBanner = z.infer<typeof seasonalCampaignBannerSchema>;

export const trustItemSchema = z.object({
  id: z.string(),
  icon: z.enum(["fabric", "handcrafted", "returns", "shipping", "secure"]),
  title: z.string(),
  description: z.string(),
});
export type TrustItem = z.infer<typeof trustItemSchema>;

export const featuredReviewSchema = z.object({
  id: z.string(),
  quote: z.string(),
  name: z.string(),
  rating: z.number().min(1).max(5),
});
export type FeaturedReview = z.infer<typeof featuredReviewSchema>;

export const inspirationImageSchema = z.object({
  id: z.string(),
  image: imageAssetSchema,
  href: z.string().optional(),
});
export type InspirationImage = z.infer<typeof inspirationImageSchema>;

export const homepageResponseSchema = z.object({
  hero: heroSectionSchema,
  shopByCollection: z.array(collectionSummarySchema),
  bestSellers: z.array(productListItemSchema),
  seasonalCampaign: seasonalCampaignBannerSchema.nullable().default(null),
  trustItems: z.array(trustItemSchema),
  featuredReviews: z.array(featuredReviewSchema),
  styleInspiration: z.array(inspirationImageSchema),
  newsletterHeading: z.string(),
  newsletterSubtext: z.string(),
  whatsappHeading: z.string(),
  whatsappSubtext: z.string(),
});
export type HomepageResponse = z.infer<typeof homepageResponseSchema>;
