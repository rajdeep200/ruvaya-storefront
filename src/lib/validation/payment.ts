import { z } from "zod";

export const paymentStatusSchema = z.enum([
  "created",
  "pending",
  "success",
  "failed",
  "cancelled",
  "user_dropped",
  "expired",
]);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const paymentStatusResponseSchema = z.object({
  /** Echo of the opaque payment capability supplied by checkout. */
  orderId: z.string().min(32),
  orderNumber: z.string(),
  status: paymentStatusSchema,
  amountPaid: z.number().nonnegative().nullable().default(null),
  canRetry: z.boolean().default(false),
  moneyMayBeDeducted: z.boolean().default(false),
  message: z.string(),
});
export type PaymentStatusResponse = z.infer<typeof paymentStatusResponseSchema>;

export const paymentRetryResponseSchema = z.object({
  paymentSessionId: z.string(),
  paymentGatewayOrderId: z.string(),
  amount: z.number().positive(),
  currency: z.literal("INR"),
});
export type PaymentRetryResponse = z.infer<typeof paymentRetryResponseSchema>;
