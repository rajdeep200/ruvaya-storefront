"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { setMockPaymentOutcome } from "@/lib/mock/paymentStore";
import type { PaymentStatus } from "@/types";

type MockCashfreeSimulatorProps = {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  amount: number;
  onComplete: () => void;
};

const OUTCOMES: { status: PaymentStatus; label: string; description: string }[] = [
  { status: "success", label: "Simulate Success", description: "Payment completes, order is confirmed." },
  { status: "failed", label: "Simulate Failed", description: "Bank/card declines. No amount deducted." },
  { status: "cancelled", label: "Simulate Cancelled", description: "Customer cancels on the payment page." },
  { status: "pending", label: "Simulate Pending", description: "Verification is delayed (e.g. UPI/netbanking)." },
  { status: "user_dropped", label: "Simulate User Dropped", description: "Browser closed before completing payment." },
];

/**
 * Stands in for the real Cashfree Hosted Checkout page in mock mode — we
 * cannot call Cashfree without live sandbox credentials, which don't belong
 * in this repo. Everything downstream (this order, /payment/status polling,
 * status messaging) runs on the exact same code path as production; only
 * this one screen is a placeholder for Cashfree's own hosted UI.
 */
export function MockCashfreeSimulator({ isOpen, orderId, orderNumber, amount, onComplete }: MockCashfreeSimulatorProps) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/50" />
        <Dialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-[70] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface p-6 shadow-xl focus:outline-none"
        >
          <VisuallyHidden asChild>
            <Dialog.Title>Mock Cashfree Checkout</Dialog.Title>
          </VisuallyHidden>
          <div className="mb-4 rounded-md bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
            MOCK MODE — this replaces Cashfree&apos;s real hosted checkout page
          </div>
          <p className="font-serif text-lg text-text-primary">Order {orderNumber}</p>
          <p className="mt-1 text-sm text-text-secondary">Amount payable: ₹{amount.toLocaleString("en-IN")}</p>

          <div className="mt-5 flex flex-col gap-2">
            {OUTCOMES.map((outcome) => (
              <Button
                key={outcome.status}
                type="button"
                variant="secondary"
                onClick={() => {
                  setMockPaymentOutcome(orderId, { status: outcome.status, amount, orderNumber });
                  onComplete();
                }}
                className="h-auto min-h-14 flex-col items-start rounded-md px-4 py-2 text-left"
              >
                <span className="block text-sm font-medium text-text-primary">{outcome.label}</span>
                <span className="block text-xs text-text-secondary">{outcome.description}</span>
              </Button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
