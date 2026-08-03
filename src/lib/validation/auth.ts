import { z } from "zod";
import { indianPhoneSchema, indianPincodeSchema } from "./checkout";

export const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type SignupFormValues = z.infer<typeof signupFormSchema>;

export const accountSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
});
export type Account = z.infer<typeof accountSchema>;

export const profileFormSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.union([indianPhoneSchema, z.literal("")]).optional(),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const accountAddressSchema = z.object({
  id: z.string(),
  label: z.string().nullable(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  addressLine: z.string(),
  locality: z.string().nullable(),
  landmark: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  isDefault: z.boolean(),
});
export type AccountAddress = z.infer<typeof accountAddressSchema>;

export const addressFormSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2, "Enter the recipient's name"),
  phone: indianPhoneSchema,
  addressLine: z.string().min(5, "Enter the full address"),
  locality: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "Enter a city"),
  state: z.string().min(2, "Enter a state"),
  pincode: indianPincodeSchema,
  isDefault: z.boolean().optional(),
});
export type AddressFormValues = z.infer<typeof addressFormSchema>;

/** First (or a representative) line item, shown as a thumbnail + name on the order list card. Optional — older backends may not send it yet. */
export const accountOrderPreviewItemSchema = z.object({
  productName: z.string(),
  imageUrl: z.string().nullable().optional(),
});
export type AccountOrderPreviewItem = z.infer<typeof accountOrderPreviewItemSchema>;

export const accountOrderSummarySchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.string(),
  total: z.number(),
  currency: z.string(),
  itemCount: z.number(),
  createdAt: z.string(),
  previewItem: accountOrderPreviewItemSchema.nullable().optional(),
});
export type AccountOrderSummary = z.infer<typeof accountOrderSummarySchema>;

export const accountOrderDetailSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.string(),
  subtotal: z.number(),
  discount: z.number(),
  shipping: z.number(),
  total: z.number(),
  currency: z.string(),
  shippingAddress: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      productName: z.string(),
      imageUrl: z.string().nullable().optional(),
      sku: z.string(),
      color: z.string(),
      size: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      total: z.number(),
      /** Non-null only when the order is delivered and this item hasn't been reviewed yet. */
      reviewToken: z.string().nullable().optional(),
    }),
  ),
  statusHistory: z.array(
    z.object({
      id: z.string(),
      toStatus: z.string(),
      reason: z.string().nullable(),
      createdAt: z.string(),
    }),
  ),
});
export type AccountOrderDetail = z.infer<typeof accountOrderDetailSchema>;
