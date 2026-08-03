import { z } from "zod";
import { addressSchema } from "./common";
import { cartLineInputSchema } from "./cart";

export const indianPincodeSchema = z
  .string()
  .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode");

export const indianPhoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

export const checkoutFormSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: indianPhoneSchema,
  email: z.string().email("Enter a valid email address"),
  addressLine: z.string().min(5, "Enter your full address"),
  locality: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  pincode: indianPincodeSchema,
  deliveryInstructions: z.string().max(200).optional(),
});
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const serviceabilityResponseSchema = z.object({
  pincode: z.string(),
  isServiceable: z.boolean(),
  city: z.string().optional(),
  state: z.string().optional(),
  estimatedDeliveryDays: z.number().int().positive().optional(),
  codAvailable: z.boolean().default(true),
  message: z.string().optional(),
});
export type ServiceabilityResponse = z.infer<typeof serviceabilityResponseSchema>;

export const checkoutRequestSchema = z.object({
  idempotencyKey: z.string(),
  address: addressSchema,
  lines: z.array(cartLineInputSchema),
  couponCode: z.string().optional(),
  affiliateCode: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .optional(),
});
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const checkoutResponseSchema = z.object({
  /** Opaque payment capability, not a database order ID. */
  orderId: z.string().min(32),
  orderNumber: z.string(),
  paymentSessionId: z.string(),
  paymentGatewayOrderId: z.string(),
  amount: z.number().positive(),
  currency: z.literal("INR"),
});
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
