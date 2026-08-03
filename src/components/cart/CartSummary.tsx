"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatInr } from "@/lib/formatting";
import { track } from "@/lib/analytics/track";
import type { CartValidationResponse } from "@/types";

type CartSummaryProps = {
  validation: CartValidationResponse | null;
  isValidating: boolean;
  fallbackSubtotal: number;
};

export function CartSummary({ validation, isValidating, fallbackSubtotal }: CartSummaryProps) {
  const router = useRouter();
  const setCouponCode = useCartStore((s) => s.setCouponCode);
  const [couponInput, setCouponInput] = useState("");

  const subtotal = validation?.subtotal ?? fallbackSubtotal;
  const discount = validation?.discount ?? 0;
  const shippingFee = validation?.shippingFee ?? 0;
  const total = validation?.total ?? fallbackSubtotal;
  const isBlocked = validation?.isCheckoutBlocked ?? false;

  function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponCode(couponInput.trim().toUpperCase());
    track("coupon_applied", { couponCode: couponInput.trim().toUpperCase() });
  }

  return (
    <div className="rounded-md border border-border p-6">
      <h2 className="font-serif text-lg text-text-primary">Order Summary</h2>

      <div className="mt-4">
        <label htmlFor="cart-coupon" className="mb-1.5 block text-xs font-medium text-text-primary">
          Coupon or affiliate code
        </label>
        <div className="flex gap-2">
          <input
            id="cart-coupon"
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter code"
            className="min-h-11 flex-1 rounded-md border border-border bg-surface px-3 text-sm uppercase outline-none focus:border-primary"
          />
          <Button type="button" variant="outline" onClick={applyCoupon} className="min-h-11 rounded-md px-4">
            Apply
          </Button>
        </div>
        {validation?.couponApplied && (
          <p className="mt-1.5 text-xs text-success">Coupon {validation.couponApplied} applied.</p>
        )}
        {validation?.couponError && (
          <p className="mt-1.5 text-xs text-error" role="alert">
            {validation.couponError}
          </p>
        )}
      </div>

      <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd className="text-text-primary">{formatInr(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-text-secondary">Discount</dt>
            <dd className="text-success">−{formatInr(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd className="text-text-primary">{shippingFee === 0 ? "Free" : formatInr(shippingFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
          <dt className="text-text-primary">Total</dt>
          <dd className="text-text-primary">{formatInr(total)}</dd>
        </div>
      </dl>

      {isBlocked && (
        <p role="alert" className="mt-4 text-xs text-error">
          Some items in your cart need attention before you can check out.
        </p>
      )}

      <Button
        type="button"
        size="lg"
        disabled={isValidating || isBlocked}
        onClick={() => {
          track("begin_checkout", { cartValue: total });
          router.push("/checkout");
        }}
        className="mt-5 min-h-12 w-full rounded-sm disabled:opacity-60"
      >
        {isValidating ? "Checking availability..." : "Proceed to Checkout"}
      </Button>

      <Link href="/kurtis" className="mt-3 block text-center text-sm font-medium text-primary hover:underline">
        Continue Shopping
      </Link>

      <p className="mt-4 text-center text-xs text-text-muted">
        <Link href="/shipping-policy" className="hover:text-primary">
          Shipping
        </Link>{" "}
        ·{" "}
        <Link href="/return-refund-policy" className="hover:text-primary">
          Returns
        </Link>{" "}
        ·{" "}
        <Link href="/cancellation-policy" className="hover:text-primary">
          Cancellations
        </Link>
      </p>
    </div>
  );
}
