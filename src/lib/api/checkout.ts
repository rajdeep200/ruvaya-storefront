import { env } from "@/config/env";
import { apiFetch } from "./client";
import {
  checkoutResponseSchema,
  serviceabilityResponseSchema,
  type CheckoutRequest,
} from "@/lib/validation/checkout";
import { mockDelay } from "@/lib/mock/delay";
import { validateMockCart } from "./cart";
import { ValidationApiError } from "./errors";

const PINCODE_LOOKUP: Record<string, { city: string; state: string }> = {
  "56": { city: "Bangalore", state: "Karnataka" },
  "40": { city: "Mumbai", state: "Maharashtra" },
  "11": { city: "Delhi", state: "Delhi" },
  "70": { city: "Kolkata", state: "West Bengal" },
  "60": { city: "Chennai", state: "Tamil Nadu" },
  "50": { city: "Hyderabad", state: "Telangana" },
};

export async function checkServiceability(pincode: string) {
  if (env.useMockApi) {
    await mockDelay(350);
    const prefix = pincode.slice(0, 2);
    const location = PINCODE_LOOKUP[prefix];
    const notServiceable = pincode.startsWith("9");
    return {
      pincode,
      isServiceable: !notServiceable,
      city: location?.city,
      state: location?.state,
      estimatedDeliveryDays: notServiceable ? undefined : location ? 3 : 6,
      codAvailable: !notServiceable,
      message: notServiceable ? "We don't deliver to this pincode yet." : undefined,
    };
  }
  return apiFetch(`/serviceability?pincode=${encodeURIComponent(pincode)}`, serviceabilityResponseSchema);
}

let mockOrderSequence = 10300;

export async function submitCheckout(request: CheckoutRequest) {
  if (env.useMockApi) {
    await mockDelay(600);
    const validation = validateMockCart({ lines: request.lines, couponCode: request.couponCode });
    if (validation.isCheckoutBlocked) {
      throw new ValidationApiError(
        "Some items in your cart are no longer available. Please update your cart and try again.",
        validation.lines,
      );
    }
    mockOrderSequence += 1;
    const orderNumber = `RUV${mockOrderSequence}`;
    return {
      orderId: `mock-order-${mockOrderSequence}`,
      orderNumber,
      paymentSessionId: `mock-session-${mockOrderSequence}`,
      paymentGatewayOrderId: `mock-cf-order-${mockOrderSequence}`,
      amount: validation.total,
      currency: "INR" as const,
    };
  }
  // Routed through the storefront's own /api/checkout proxy (not admin-api
  // directly) so the httpOnly customer-session cookie can authenticate it —
  // see src/app/api/checkout/route.ts.
  return apiFetch("/api/checkout", checkoutResponseSchema, {
    method: "POST",
    body: request,
    headers: { "Idempotency-Key": request.idempotencyKey },
    baseUrl: "",
  });
}
