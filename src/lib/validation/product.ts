import { z } from "zod";
import { imageAssetSchema, moneySchema, videoAssetSchema } from "./common";

export const productBadgeSchema = z.enum(["new", "bestseller", "sale"]);
export type ProductBadge = z.infer<typeof productBadgeSchema>;

export const sizeAvailabilitySchema = z.object({
  size: z.string(),
  sku: z.string(),
  inStock: z.boolean(),
});
export type SizeAvailability = z.infer<typeof sizeAvailabilitySchema>;

export const colorVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex: z.string(),
  images: z.array(imageAssetSchema).min(1),
  sizes: z.array(sizeAvailabilitySchema).min(1),
});
export type ColorVariant = z.infer<typeof colorVariantSchema>;

export const ratingSummarySchema = z.object({
  average: z.number().min(0).max(5),
  count: z.number().int().nonnegative(),
  distribution: z
    .object({
      1: z.number().int().nonnegative(),
      2: z.number().int().nonnegative(),
      3: z.number().int().nonnegative(),
      4: z.number().int().nonnegative(),
      5: z.number().int().nonnegative(),
    })
    .optional(),
});
export type RatingSummary = z.infer<typeof ratingSummarySchema>;

export const measurementRowSchema = z.object({
  size: z.string(),
  bustIn: z.number().positive(),
  waistIn: z.number().positive(),
  hipIn: z.number().positive(),
  lengthIn: z.number().positive(),
  sleeveLengthIn: z.number().positive().optional(),
});
export type MeasurementRow = z.infer<typeof measurementRowSchema>;

const baseProductFields = {
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  collectionSlugs: z.array(z.string()).default([]),
  fabric: z.string(),
  occasion: z.array(z.string()).default([]),
  price: moneySchema,
  salePrice: moneySchema.nullable().default(null),
  badges: z.array(productBadgeSchema).default([]),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
  rating: ratingSummarySchema,
  isAvailable: z.boolean().default(true),
};

export const productListItemSchema = z.object({
  ...baseProductFields,
  primaryImage: imageAssetSchema,
  hoverImage: imageAssetSchema.optional(),
});
export type ProductListItem = z.infer<typeof productListItemSchema>;

export const productDetailSchema = z.object({
  ...baseProductFields,
  description: z.string(),
  images: z.array(imageAssetSchema).min(1),
  video: videoAssetSchema.optional(),
  colorVariants: z.array(colorVariantSchema).min(1),
  fabricDetails: z.string(),
  fitDetails: z.string(),
  neckType: z.string(),
  sleeveType: z.string(),
  kurtiLength: z.string(),
  sideSlit: z.string().optional(),
  washCare: z.array(z.string()).default([]),
  measurements: z.array(measurementRowSchema).default([]),
  modelInfo: z
    .object({
      heightCm: z.number().positive(),
      sizeWorn: z.string(),
    })
    .optional(),
  shippingInfo: z.string(),
  returnEligible: z.boolean(),
  returnWindowDays: z.number().int().nonnegative().optional(),
  inclusiveOfTaxes: z.boolean().default(true),
  similarProductSlugs: z.array(z.string()).default([]),
});
export type ProductDetail = z.infer<typeof productDetailSchema>;

/** ProductDetail is a superset of ProductListItem — used to build card-friendly summaries (similar products, recently viewed) from a full detail fetch without a second network shape. */
export function productDetailToListItem(product: ProductDetail): ProductListItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    collectionSlugs: product.collectionSlugs,
    fabric: product.fabric,
    occasion: product.occasion,
    price: product.price,
    salePrice: product.salePrice,
    badges: product.badges,
    colors: product.colors,
    rating: product.rating,
    isAvailable: product.isAvailable,
    primaryImage: product.images[0],
    hoverImage: product.images[1],
  };
}

export const productSortSchema = z.enum(["newest", "popularity", "price_asc", "price_desc"]);
export type ProductSort = z.infer<typeof productSortSchema>;

export const productFilterOptionsSchema = z.object({
  sizes: z.array(z.string()),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
  fabrics: z.array(z.string()),
  occasions: z.array(z.string()),
  priceRange: z.object({ min: z.number(), max: z.number() }),
});
export type ProductFilterOptions = z.infer<typeof productFilterOptionsSchema>;

export const productListResponseSchema = z.object({
  items: z.array(productListItemSchema),
  filters: productFilterOptionsSchema,
  totalItems: z.number().int().nonnegative(),
});
export type ProductListResponse = z.infer<typeof productListResponseSchema>;
