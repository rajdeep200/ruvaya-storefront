import { z } from "zod";

export const cartLineInputSchema = z.object({
  productId: z.string(),
  productSlug: z.string(),
  colorId: z.string(),
  size: z.string(),
  quantity: z.number().int().positive().max(10),
});
export type CartLineInput = z.infer<typeof cartLineInputSchema>;

export const cartValidationRequestSchema = z.object({
  lines: z.array(cartLineInputSchema),
  couponCode: z.string().optional(),
  pincode: z.string().length(6).optional(),
});
export type CartValidationRequest = z.infer<typeof cartValidationRequestSchema>;

export const cartLineValidationSchema = z.object({
  productId: z.string(),
  colorId: z.string(),
  size: z.string(),
  requestedQuantity: z.number().int().nonnegative(),
  maxQuantity: z.number().int().nonnegative(),
  isAvailable: z.boolean(),
  unitPrice: z.number().nonnegative(),
  unitSalePrice: z.number().nullable(),
  priceChanged: z.boolean().default(false),
  message: z.string().optional(),
});
export type CartLineValidation = z.infer<typeof cartLineValidationSchema>;

export const cartValidationResponseSchema = z.object({
  lines: z.array(cartLineValidationSchema),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  couponApplied: z.string().nullable().default(null),
  couponError: z.string().nullable().default(null),
  messages: z.array(z.string()).default([]),
  isCheckoutBlocked: z.boolean().default(false),
});
export type CartValidationResponse = z.infer<typeof cartValidationResponseSchema>;
