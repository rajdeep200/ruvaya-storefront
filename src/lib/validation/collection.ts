import { z } from "zod";
import { imageAssetSchema, seoSchema } from "./common";
import { productListItemSchema } from "./product";

export const collectionSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  image: imageAssetSchema,
});
export type CollectionSummary = z.infer<typeof collectionSummarySchema>;

export const collectionDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  heroImage: imageAssetSchema.optional(),
  seo: seoSchema.optional(),
  products: z.array(productListItemSchema),
});
export type CollectionDetail = z.infer<typeof collectionDetailSchema>;
