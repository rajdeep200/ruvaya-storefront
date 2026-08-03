"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cart";
import { useCheckoutDraftStore } from "@/store/checkoutDraft";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/validation/checkout";
import { validateCart } from "@/lib/api/cart";
import { submitCheckout } from "@/lib/api/checkout";
import { ApiError } from "@/lib/api/errors";
import { openCashfreeCheckout } from "@/lib/cashfree";
import { env } from "@/config/env";
import { getStoredAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/track";
import { formatInr } from "@/lib/formatting";
import { AddressFields } from "./AddressFields";
import { SavedAddressPicker } from "./SavedAddressPicker";
import { MockCashfreeSimulator } from "@/components/payment/MockCashfreeSimulator";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import type { Account, AccountAddress } from "@/lib/validation/auth";
import type { CartValidationResponse, CheckoutResponse } from "@/types";

export function CheckoutPageClient({ account, addresses }: { account: Account; addresses: AccountAddress[] }) {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const couponCode = useCartStore((s) => s.couponCode);
  const draft = useCheckoutDraftStore();

  const [validation, setValidation] = useState<CartValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingResponse, setPendingResponse] = useState<CheckoutResponse | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const submitLockRef = useRef(false);
  const requestIdRef = useRef(0);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: draft.formValues?.fullName ?? defaultAddress?.fullName ?? account.name,
      phone: draft.formValues?.phone ?? defaultAddress?.phone ?? account.phone ?? "",
      email: draft.formValues?.email ?? defaultAddress?.email ?? account.email,
      addressLine: draft.formValues?.addressLine ?? defaultAddress?.addressLine ?? "",
      locality: draft.formValues?.locality ?? defaultAddress?.locality ?? "",
      landmark: draft.formValues?.landmark ?? defaultAddress?.landmark ?? "",
      city: draft.formValues?.city ?? defaultAddress?.city ?? "",
      state: draft.formValues?.state ?? defaultAddress?.state ?? "",
      pincode: draft.formValues?.pincode ?? defaultAddress?.pincode ?? "",
      deliveryInstructions: draft.formValues?.deliveryInstructions ?? "",
    },
  });

  const pincode = form.watch("pincode");

  useEffect(() => {
    if (lines.length === 0 && !draft.pendingOrder) {
      router.replace("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lines.length === 0) return;
    const requestId = ++requestIdRef.current;
    const timer = setTimeout(() => {
      setIsValidating(true);
      validateCart({
        lines: lines.map((l) => ({
          productId: l.productId,
          productSlug: l.productSlug,
          colorId: l.colorId,
          size: l.size,
          quantity: l.quantity,
        })),
        couponCode: couponCode ?? undefined,
        pincode: /^\d{6}$/.test(pincode ?? "") ? pincode : undefined,
      })
        .then((res) => {
          if (requestIdRef.current === requestId) setValidation(res);
        })
        .catch(() => {
          if (requestIdRef.current === requestId) setValidation(null);
        })
        .finally(() => {
          if (requestIdRef.current === requestId) setIsValidating(false);
        });
    }, 400);
    return () => clearTimeout(timer);
  }, [lines, couponCode, pincode]);

  async function onSubmit(values: CheckoutFormValues) {
    if (submitLockRef.current) return;
    if (validation?.isCheckoutBlocked) {
      setSubmitError("Some items in your cart need attention. Please review your cart before continuing.");
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    draft.setFormValues(values);
    track("address_submitted", {});

    const idempotencyKey = draft.ensureIdempotencyKey();
    const attribution = getStoredAttribution();

    try {
      const response = await submitCheckout({
        idempotencyKey,
        address: values,
        lines: lines.map((l) => ({
          productId: l.productId,
          productSlug: l.productSlug,
          colorId: l.colorId,
          size: l.size,
          quantity: l.quantity,
        })),
        couponCode: couponCode ?? undefined,
        affiliateCode: attribution.affiliateCode,
        utm: {
          source: attribution.utmSource,
          medium: attribution.utmMedium,
          campaign: attribution.utmCampaign,
          content: attribution.utmContent,
          term: attribution.utmTerm,
        },
      });

      draft.setPendingOrder(response);
      draft.resetIdempotencyKey();
      track("checkout_step_completed", { metadata: { step: "address" } });
      track("order_created", { orderId: response.orderId, orderValue: response.amount });
      track("payment_initiated", { orderId: response.orderId, orderValue: response.amount });

      if (env.useMockApi) {
        setPendingResponse(response);
      } else {
        await openCashfreeCheckout(response.paymentSessionId);
      }
    } catch (error) {
      submitLockRef.current = false;
      setIsSubmitting(false);
      if (error instanceof ApiError) {
        if (error.code === "PRICE_CHANGED" || error.code === "PRODUCT_UNAVAILABLE") {
          setSubmitError(
            "Some prices or availability changed since you added these items. Please review your cart and try again.",
          );
        } else if (error.code === "NETWORK_ERROR") {
          setSubmitError("We couldn't reach Ruvaya. Your details are saved — please check your connection and try again.");
        } else {
          setSubmitError(error.message);
        }
      } else {
        setSubmitError("Something went wrong placing your order. Your details are saved — please try again.");
      }
    }
  }

  if (lines.length === 0 && !draft.pendingOrder) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <EmptyState title="Your cart is empty" description="Add a few kurtis before checking out." />
      </div>
    );
  }

  const subtotal = validation?.subtotal ?? lines.reduce((sum, l) => sum + (l.unitSalePriceSnapshot ?? l.unitPriceSnapshot) * l.quantity, 0);
  const total = validation?.total ?? subtotal;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-serif text-2xl text-text-primary uppercase">Checkout</h1>
      <p className="mt-1 text-xs tracking-wide text-text-muted uppercase">Delivery details &amp; payment</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="order-2 lg:order-1"
        >
          {addresses.length > 0 && <SavedAddressPicker addresses={addresses} form={form} />}
          <AddressFields form={form} />

          {submitError && (
            <div role="alert" className="mt-5 rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isValidating}
            className="mt-6 h-auto min-h-12 w-full rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-60 lg:hidden"
          >
            {isSubmitting ? "Placing your order..." : `Pay ${formatInr(total)}`}
          </Button>

          <p className="mt-4 text-xs text-text-muted">
            By placing this order you agree to our{" "}
            <Link href="/shipping-policy" className="underline hover:text-primary">
              Shipping
            </Link>
            ,{" "}
            <Link href="/return-refund-policy" className="underline hover:text-primary">
              Return &amp; Refund
            </Link>{" "}
            and{" "}
            <Link href="/cancellation-policy" className="underline hover:text-primary">
              Cancellation
            </Link>{" "}
            policies.
          </p>

          <Button
            type="submit"
            disabled={isSubmitting || isValidating}
            className="mt-6 hidden h-auto min-h-12 w-full rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-60 lg:block"
          >
            {isSubmitting ? "Placing your order..." : `Pay ${formatInr(total)}`}
          </Button>
        </form>

        <div className="order-1 lg:order-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsSummaryOpen((v) => !v)}
            className="h-auto w-full justify-between rounded-md px-4 py-3 lg:hidden"
          >
            Order Summary · {formatInr(total)}
            <span aria-hidden="true">{isSummaryOpen ? "−" : "+"}</span>
          </Button>

          <div className={`${isSummaryOpen ? "block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
            <div className="mt-3 rounded-md border border-border p-5 lg:mt-0">
              <ul className="mb-4 flex flex-col gap-3">
                {lines.map((line) => (
                  <li key={line.lineId} className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      {line.productName} ({line.colorName}, {line.size}) × {line.quantity}
                    </span>
                    <span className="shrink-0 text-text-primary">
                      {formatInr((line.unitSalePriceSnapshot ?? line.unitPriceSnapshot) * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-1.5 border-t border-border pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Subtotal</dt>
                  <dd>{formatInr(subtotal)}</dd>
                </div>
                {(validation?.discount ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Discount</dt>
                    <dd className="text-success">−{formatInr(validation!.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Shipping</dt>
                  <dd>{(validation?.shippingFee ?? 0) === 0 ? "Free" : formatInr(validation!.shippingFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
                  <dt>Total</dt>
                  <dd>{formatInr(total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {pendingResponse && (
        <MockCashfreeSimulator
          isOpen
          orderId={pendingResponse.orderId}
          orderNumber={pendingResponse.orderNumber}
          amount={pendingResponse.amount}
          onComplete={() => router.push(`/payment/status?order=${pendingResponse.orderId}`)}
        />
      )}
    </div>
  );
}
