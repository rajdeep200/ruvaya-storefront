import { env } from "@/config/env";
import { apiFetch } from "./client";
import { paymentRetryResponseSchema, paymentStatusResponseSchema, type PaymentStatus } from "@/lib/validation/payment";
import { mockDelay } from "@/lib/mock/delay";
import { getMockPaymentOutcome } from "@/lib/mock/paymentStore";

const STATUS_MESSAGES: Record<PaymentStatus, string> = {
  created: "We're setting up your payment.",
  pending:
    "We're verifying your payment with your bank. This can take a minute — please don't refresh or close this page.",
  success: "Payment received. Your order is confirmed!",
  failed: "Your payment did not go through. No amount was deducted. Please try again.",
  cancelled: "You cancelled the payment. No amount was deducted.",
  user_dropped:
    "It looks like the payment window closed before finishing. If any amount was deducted, it will be refunded automatically within 5-7 business days.",
  expired: "This payment session has expired. Please retry to generate a new one.",
};

const CAN_RETRY: Record<PaymentStatus, boolean> = {
  created: false,
  pending: false,
  success: false,
  failed: true,
  cancelled: true,
  user_dropped: true,
  expired: true,
};

const MONEY_MAY_BE_DEDUCTED: Record<PaymentStatus, boolean> = {
  created: false,
  pending: true,
  success: true,
  failed: false,
  cancelled: false,
  user_dropped: true,
  expired: false,
};

export async function getPaymentStatus(paymentCapability: string) {
  if (env.useMockApi) {
    await mockDelay(500);
    const record = getMockPaymentOutcome(paymentCapability);
    const status: PaymentStatus = record?.status ?? "pending";
    return {
      orderId: paymentCapability,
      orderNumber: record?.orderNumber ?? paymentCapability,
      status,
      amountPaid: status === "success" ? record?.amount ?? null : null,
      canRetry: CAN_RETRY[status],
      moneyMayBeDeducted: MONEY_MAY_BE_DEDUCTED[status],
      message: STATUS_MESSAGES[status],
    };
  }
  return apiFetch(`/payments/status?orderId=${encodeURIComponent(paymentCapability)}`, paymentStatusResponseSchema);
}

export async function retryPayment(paymentCapability: string) {
  if (env.useMockApi) {
    await mockDelay(400);
    const record = getMockPaymentOutcome(paymentCapability);
    return {
      paymentSessionId: `mock-session-retry-${paymentCapability}`,
      paymentGatewayOrderId: `mock-cf-order-retry-${paymentCapability}`,
      amount: record?.amount ?? 0,
      currency: "INR" as const,
    };
  }
  return apiFetch("/payments/retry", paymentRetryResponseSchema, {
    method: "POST",
    body: { orderId: paymentCapability },
  });
}
