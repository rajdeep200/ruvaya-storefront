import type { PaymentStatus } from "@/lib/validation/payment";

/**
 * Client-only store standing in for the Cashfree webhook + backend status
 * table in mock mode. Real Cashfree credentials can't live in this repo, so
 * the mock "hosted checkout" (see components/payment/MockCashfreeSimulator)
 * writes an outcome here instead of redirecting to Cashfree, and this module
 * is what /payment/status reads back — keeping the polling/verification UI
 * on the exact same code path it would use against the real backend.
 */
const STORAGE_PREFIX = "ruvaya-mock-payment:";

type MockPaymentRecord = {
  status: PaymentStatus;
  amount: number;
  orderNumber: string;
};

export function setMockPaymentOutcome(orderId: string, record: MockPaymentRecord): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${STORAGE_PREFIX}${orderId}`, JSON.stringify(record));
}

export function getMockPaymentOutcome(orderId: string): MockPaymentRecord | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${orderId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockPaymentRecord;
  } catch {
    return null;
  }
}
