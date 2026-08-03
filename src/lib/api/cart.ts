import { env } from "@/config/env";
import { apiFetch } from "./client";
import {
  cartValidationResponseSchema,
  type CartValidationRequest,
  type CartValidationResponse,
  type CartLineValidation,
} from "@/lib/validation/cart";
import { mockDelay } from "@/lib/mock/delay";
import { findMockProductBySlug } from "@/lib/mock/products";

const MAX_QUANTITY_PER_LINE = 5;
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 79;
const MOCK_COUPONS: Record<string, number> = {
  RUVAYA10: 0.1,
  WELCOME150: 0, // flat-amount coupon handled separately below
};

export function validateMockCart(request: CartValidationRequest): CartValidationResponse {
  const lines: CartLineValidation[] = request.lines.map((line) => {
    const product = findMockProductBySlug(line.productSlug);
    const colorVariant = product?.colorVariants.find((cv) => cv.id === line.colorId);
    const sizeVariant = colorVariant?.sizes.find((s) => s.size === line.size);

    if (!product || !colorVariant || !sizeVariant) {
      return {
        productId: line.productId,
        colorId: line.colorId,
        size: line.size,
        requestedQuantity: line.quantity,
        maxQuantity: 0,
        isAvailable: false,
        unitPrice: 0,
        unitSalePrice: null,
        priceChanged: false,
        message: "This item is no longer available.",
      };
    }

    return {
      productId: product.id,
      colorId: colorVariant.id,
      size: line.size,
      requestedQuantity: line.quantity,
      maxQuantity: sizeVariant.inStock ? MAX_QUANTITY_PER_LINE : 0,
      isAvailable: sizeVariant.inStock,
      unitPrice: product.price.amount,
      unitSalePrice: product.salePrice?.amount ?? null,
      priceChanged: false,
      message: sizeVariant.inStock ? undefined : `Size ${line.size} just sold out.`,
    };
  });

  const subtotal = lines.reduce((sum, line) => {
    if (!line.isAvailable) return sum;
    const unit = line.unitSalePrice ?? line.unitPrice;
    return sum + unit * line.requestedQuantity;
  }, 0);

  let discount = 0;
  let couponApplied: string | null = null;
  let couponError: string | null = null;
  const coupon = request.couponCode?.trim().toUpperCase();
  if (coupon) {
    if (coupon === "WELCOME150" && subtotal >= 999) {
      discount = 150;
      couponApplied = coupon;
    } else if (coupon in MOCK_COUPONS && MOCK_COUPONS[coupon] > 0) {
      discount = Math.round(subtotal * MOCK_COUPONS[coupon]);
      couponApplied = coupon;
    } else {
      couponError = "This coupon code isn't valid or has expired.";
    }
  }

  const shippingFee = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(subtotal - discount, 0) + shippingFee;
  const isCheckoutBlocked = lines.some((l) => !l.isAvailable);

  const messages: string[] = [];
  if (isCheckoutBlocked) {
    messages.push("Some items in your cart are no longer available. Please review before checkout.");
  }

  return { lines, subtotal, discount, shippingFee, total, couponApplied, couponError, messages, isCheckoutBlocked };
}

export async function validateCart(request: CartValidationRequest) {
  if (env.useMockApi) {
    await mockDelay(400);
    return validateMockCart(request);
  }
  return apiFetch("/cart/validate", cartValidationResponseSchema, {
    method: "POST",
    body: request,
  });
}
