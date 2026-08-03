import { z } from "zod";

export const moneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.literal("INR").default("INR"),
});
export type Money = z.infer<typeof moneySchema>;

export const imageAssetSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type ImageAsset = z.infer<typeof imageAssetSchema>;

export const videoAssetSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  posterUrl: z.string().url().optional(),
  alt: z.string().default(""),
});
export type VideoAsset = z.infer<typeof videoAssetSchema>;

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  canonicalPath: z.string().optional(),
  ogImageUrl: z.string().url().optional(),
});
export type Seo = z.infer<typeof seoSchema>;

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});
export type NavLink = z.infer<typeof linkSchema>;

export const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string(),
  email: z.string().email(),
  addressLine: z.string().min(1),
  locality: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().length(6),
  deliveryInstructions: z.string().optional(),
});
export type Address = z.infer<typeof addressSchema>;

export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export const apiErrorEnvelopeSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ApiErrorEnvelope = z.infer<typeof apiErrorEnvelopeSchema>;
