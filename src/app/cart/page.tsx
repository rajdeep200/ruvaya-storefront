"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { validateCart } from "@/lib/api/cart";
import { CartLineRow } from "@/components/cart/CartLineRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/common/EmptyState";
import { TrackViewEvent } from "@/components/common/TrackViewEvent";
import type { CartValidationResponse } from "@/types";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const couponCode = useCartStore((s) => s.couponCode);
  const [validation, setValidation] = useState<CartValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    // When the cart is empty, the component renders the EmptyState branch
    // instead of CartSummary, so stale validation data here is unused —
    // no need to clear it synchronously.
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
    }, 300);

    return () => clearTimeout(timer);
  }, [lines, couponCode]);

  const fallbackSubtotal = lines.reduce(
    (sum, l) => sum + (l.unitSalePriceSnapshot ?? l.unitPriceSnapshot) * l.quantity,
    0,
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Everything you add will be saved here — even if you close the tab."
          action={
            <Link href="/kurtis" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
              Shop All Kurtis
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <TrackViewEvent name="cart_view" cartValue={fallbackSubtotal} />
      <h1 className="font-serif text-2xl text-text-primary uppercase">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul>
          {lines.map((line) => (
            <CartLineRow
              key={line.lineId}
              line={line}
              validation={validation?.lines.find(
                (v) => v.productId === line.productId && v.colorId === line.colorId && v.size === line.size,
              )}
            />
          ))}
        </ul>

        <div>
          <CartSummary validation={validation} isValidating={isValidating} fallbackSubtotal={fallbackSubtotal} />
        </div>
      </div>
    </div>
  );
}
