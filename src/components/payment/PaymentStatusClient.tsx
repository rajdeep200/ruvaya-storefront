"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getPaymentStatus, retryPayment } from "@/lib/api/payments";
import { useCartStore } from "@/store/cart";
import { useCheckoutDraftStore } from "@/store/checkoutDraft";
import { useLastOrderStore } from "@/store/lastOrder";
import { MockCashfreeSimulator } from "@/components/payment/MockCashfreeSimulator";
import { Button } from "@/components/ui/button";
import { openCashfreeCheckout } from "@/lib/cashfree";
import { env } from "@/config/env";
import { track } from "@/lib/analytics/track";
import type { PaymentStatusResponse } from "@/types";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 15; // ~45s before we call it "delayed" rather than failed

function PaymentStatusInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartClear = useCartStore((s) => s.clearCart);
  const draft = useCheckoutDraftStore();

  const orderId =
    searchParams.get("orderId") ??
    searchParams.get("order") ??
    searchParams.get("order_id") ??
    draft.pendingOrder?.orderId ??
    null;

  const [phase, setPhase] = useState<"checking" | "result" | "delayed">("checking");
  const [response, setResponse] = useState<PaymentStatusResponse | null>(null);
  const [retrySession, setRetrySession] = useState<{ orderId: string; orderNumber: string; amount: number } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const attemptsRef = useRef(0);
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function poll() {
      getPaymentStatus(orderId!)
        .then((res) => {
          if (cancelled) return;
          setResponse(res);

          if (res.status === "pending" || res.status === "created") {
            attemptsRef.current += 1;
            if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
              setPhase("delayed");
            } else {
              timer = setTimeout(poll, POLL_INTERVAL_MS);
            }
          } else {
            setPhase("result");
          }
        })
        .catch(() => {
          if (!cancelled) setPhase("delayed");
        });
    }

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  useEffect(() => {
    if (!response || trackedRef.current === response.status) return;
    trackedRef.current = response.status;

    if (response.status === "success") {
      track("payment_success", { orderId: response.orderId, orderValue: response.amountPaid ?? undefined });
      track("purchase", { orderId: response.orderId, orderValue: response.amountPaid ?? undefined });

      const linesSnapshot = useCartStore.getState().lines;
      const addressSnapshot = draft.formValues;
      if (addressSnapshot) {
        useLastOrderStore.getState().setOrder({
          orderNumber: response.orderNumber,
          amountPaid: response.amountPaid ?? 0,
          placedAt: new Date().toISOString(),
          items: linesSnapshot.map((l) => ({
            productName: l.productName,
            image: l.image,
            size: l.size,
            colorName: l.colorName,
            quantity: l.quantity,
            unitPrice: l.unitSalePriceSnapshot ?? l.unitPriceSnapshot,
          })),
          shippingAddress: {
            fullName: addressSnapshot.fullName ?? "",
            addressLine: addressSnapshot.addressLine ?? "",
            locality: addressSnapshot.locality,
            city: addressSnapshot.city ?? "",
            state: addressSnapshot.state ?? "",
            pincode: addressSnapshot.pincode ?? "",
          },
        });
      }

      cartClear();
      draft.clearDraft();
    } else if (response.status === "failed") {
      track("payment_failed", { orderId: response.orderId });
    } else if (response.status === "cancelled") {
      track("payment_cancelled", { orderId: response.orderId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  async function handleRetry() {
    if (!orderId || !response) return;
    setIsRetrying(true);
    track("payment_retry", { orderId });
    try {
      const session = await retryPayment(orderId);
      draft.setPendingOrder({
        orderId,
        orderNumber: response.orderNumber,
        paymentSessionId: session.paymentSessionId,
        paymentGatewayOrderId: session.paymentGatewayOrderId,
        amount: session.amount,
      });
      if (env.useMockApi) {
        setRetrySession({ orderId, orderNumber: response.orderNumber, amount: session.amount });
      } else {
        await openCashfreeCheckout(session.paymentSessionId);
      }
    } finally {
      setIsRetrying(false);
    }
  }

  if (!orderId) {
    return (
      <StatusShell
        title="We couldn't find this payment"
        message="This link may have expired. If money was deducted, it will be visible against your order — track it below or contact support."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/track-order" className="min-h-11 rounded-sm bg-primary px-6 py-3 text-center text-sm font-medium text-white">
            Track an Order
          </Link>
          <Link href="/help" className="min-h-11 rounded-sm border border-border px-6 py-3 text-center text-sm font-medium text-text-primary">
            Contact Support
          </Link>
        </div>
      </StatusShell>
    );
  }

  if (phase === "checking") {
    return (
      <StatusShell title="Verifying your payment" message="Please don't refresh or close this page — this usually takes a few seconds.">
        <div className="flex justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
        </div>
      </StatusShell>
    );
  }

  if (phase === "delayed") {
    return (
      <StatusShell
        title="Verification is taking longer than usual"
        message="If any amount was deducted, it is safe — we'll confirm your order automatically once your bank/payment provider responds. Please avoid retrying immediately, as that may create a duplicate charge."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => {
              attemptsRef.current = 0;
              setPhase("checking");
            }}
            className="h-auto min-h-11 rounded-sm px-6 py-3"
          >
            Check Again
          </Button>
          <Link href="/help" className="min-h-11 rounded-sm border border-border px-6 py-3 text-center text-sm font-medium text-text-primary">
            Contact Support
          </Link>
        </div>
      </StatusShell>
    );
  }

  if (!response) return null;

  if (response.status === "success") {
    return (
      <StatusShell title="Payment successful!" message={`Order ${response.orderNumber} is confirmed. Redirecting you to your order...`}>
        <RedirectOnMount href={`/order-confirmation/${response.orderNumber}`} />
        <Link href={`/order-confirmation/${response.orderNumber}`} className="min-h-11 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-white">
          View Order Confirmation
        </Link>
      </StatusShell>
    );
  }

  const isRetryable = response.canRetry;

  return (
    <StatusShell
      title={
        response.status === "cancelled"
          ? "Payment cancelled"
          : response.status === "expired"
            ? "Payment session expired"
            : response.status === "user_dropped"
              ? "Payment wasn't completed"
              : "Payment failed"
      }
      message={
        response.message +
        (response.moneyMayBeDeducted
          ? " If any amount was deducted, it will be refunded automatically within 5-7 business days."
          : "")
      }
    >
      <p className="mb-3 text-xs text-text-muted">Order {response.orderNumber}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {isRetryable && (
          <Button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="h-auto min-h-11 rounded-sm px-6 py-3 disabled:opacity-60"
          >
            {isRetrying ? "Preparing retry..." : "Retry Payment"}
          </Button>
        )}
        <Link href="/help" className="min-h-11 rounded-sm border border-border px-6 py-3 text-center text-sm font-medium text-text-primary">
          Contact Support
        </Link>
      </div>
      {isRetryable && (
        <p className="mt-3 text-xs text-text-muted">
          Retrying will not charge you twice — we reuse the same order.
        </p>
      )}

      {retrySession && (
        <MockCashfreeSimulator
          isOpen
          orderId={retrySession.orderId}
          orderNumber={retrySession.orderNumber}
          amount={retrySession.amount}
          onComplete={() => {
            setRetrySession(null);
            attemptsRef.current = 0;
            setPhase("checking");
            trackedRef.current = null;
            router.replace(`/payment/status?order=${retrySession.orderId}`);
          }}
        />
      )}
    </StatusShell>
  );
}

function RedirectOnMount({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.push(href), 1500);
    return () => clearTimeout(timer);
  }, [href, router]);
  return null;
}

function StatusShell({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="font-serif text-2xl text-text-primary">{title}</h1>
      <p className="mt-3 text-sm text-text-secondary">{message}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function PaymentStatusClient() {
  return (
    <Suspense fallback={<StatusShell title="Verifying your payment" message="Please wait..." />}>
      <PaymentStatusInner />
    </Suspense>
  );
}
