import { z } from "zod";
import { imageAssetSchema } from "./common";
import { paymentStatusSchema } from "./payment";

export const orderStatusSchema = z.enum([
  "payment_received",
  "availability_being_verified",
  "order_confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refund_initiated",
  "refunded",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderItemSchema = z.object({
  productName: z.string(),
  productSlug: z.string(),
  image: imageAssetSchema,
  size: z.string(),
  color: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderTimelineStepSchema = z.object({
  status: orderStatusSchema,
  label: z.string(),
  timestamp: z.string().datetime().nullable(),
  completed: z.boolean(),
});
export type OrderTimelineStep = z.infer<typeof orderTimelineStepSchema>;

export const orderDetailSchema = z.object({
  orderNumber: z.string(),
  secureToken: z.string(),
  status: orderStatusSchema,
  paymentStatus: paymentStatusSchema,
  placedAt: z.string().datetime(),
  items: z.array(orderItemSchema),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  amountPaid: z.number().nonnegative(),
  shippingAddress: z.object({
    fullName: z.string(),
    addressLine: z.string(),
    locality: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  timeline: z.array(orderTimelineStepSchema),
  estimatedDeliveryAt: z.string().datetime().nullable().default(null),
});
export type OrderDetail = z.infer<typeof orderDetailSchema>;

export const trackOrderRequestSchema = z.object({
  orderNumber: z.string().min(3, "Enter your order number"),
  contact: z.string().min(3, "Enter your phone number or email"),
});
export type TrackOrderRequest = z.infer<typeof trackOrderRequestSchema>;

export const trackOrderResponseSchema = z.object({
  secureToken: z.string(),
});
export type TrackOrderResponse = z.infer<typeof trackOrderResponseSchema>;
