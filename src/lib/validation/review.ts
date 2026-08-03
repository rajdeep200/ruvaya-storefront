import { z } from "zod";
import { imageAssetSchema } from "./common";
import { ratingSummarySchema } from "./product";

export const fitFeedbackSchema = z.enum(["runs_small", "true_to_size", "runs_large"]);
export type FitFeedback = z.infer<typeof fitFeedbackSchema>;

export const reviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string(),
  text: z.string(),
  fitFeedback: fitFeedbackSchema.optional(),
  purchasedSize: z.string().optional(),
  recommend: z.boolean().optional(),
  images: z.array(imageAssetSchema).default([]),
  isVerifiedPurchase: z.boolean(),
  customerName: z.string(),
  createdAt: z.string().datetime(),
  adminReply: z.string().nullable().default(null),
  helpfulCount: z.number().int().nonnegative().default(0),
});
export type Review = z.infer<typeof reviewSchema>;

export const reviewSortSchema = z.enum(["helpful", "recent", "highest", "lowest"]);
export type ReviewSort = z.infer<typeof reviewSortSchema>;

export const reviewListResponseSchema = z.object({
  summary: ratingSummarySchema,
  reviews: z.array(reviewSchema),
  totalItems: z.number().int().nonnegative(),
});
export type ReviewListResponse = z.infer<typeof reviewListResponseSchema>;

export const reviewTokenContextSchema = z.object({
  isValid: z.boolean(),
  productName: z.string().optional(),
  productImage: imageAssetSchema.optional(),
  orderNumber: z.string().optional(),
  purchasedSize: z.string().optional(),
  alreadySubmitted: z.boolean().default(false),
});
export type ReviewTokenContext = z.infer<typeof reviewTokenContextSchema>;

export const reviewSubmissionSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Give your review a short title"),
  text: z.string().min(10, "Tell us a little more about your experience"),
  fitFeedback: fitFeedbackSchema.optional(),
  purchasedSize: z.string().optional(),
  heightCm: z.number().positive().optional(),
  recommend: z.boolean().optional(),
  displayConsent: z.boolean(),
});
export type ReviewSubmissionValues = z.infer<typeof reviewSubmissionSchema>;

export const reviewSubmissionAckSchema = z.object({
  submitted: z.boolean(),
  message: z.string(),
});
export type ReviewSubmissionAck = z.infer<typeof reviewSubmissionAckSchema>;
