"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore, MAX_CART_LINE_QUANTITY, type CartLine } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatInr } from "@/lib/formatting";
import { track } from "@/lib/analytics/track";
import type { CartLineValidation } from "@/types";

type CartLineRowProps = {
  line: CartLine;
  validation?: CartLineValidation;
};

export function CartLineRow({ line, validation }: CartLineRowProps) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const addToWishlist = useWishlistStore((s) => s.add);

  const unitPrice = validation ? (validation.unitSalePrice ?? validation.unitPrice) : (line.unitSalePriceSnapshot ?? line.unitPriceSnapshot);
  const isUnavailable = validation ? !validation.isAvailable : false;

  return (
    <li className="flex gap-4 border-b border-border py-6 first:pt-0">
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
        <Image src={line.image.url} alt={line.image.alt} fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${line.productSlug}`} className="text-sm font-medium text-text-primary hover:text-primary">
            {line.productName}
          </Link>
          <span className="shrink-0 text-sm font-medium text-text-primary">{formatInr(unitPrice * line.quantity)}</span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          {line.colorName} · Size {line.size}
        </p>

        {validation?.priceChanged && (
          <p className="mt-1 text-xs text-warning">Price updated to {formatInr(unitPrice)} per item.</p>
        )}
        {isUnavailable && (
          <p className="mt-1 text-xs text-error">{validation?.message ?? "This item is no longer available."}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-border">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Decrease quantity"
              onClick={() => {
                setQuantity(line.lineId, line.quantity - 1);
                track("cart_quantity_changed", { productId: line.productId, quantity: line.quantity - 1 });
              }}
              disabled={line.quantity <= 1}
              className="rounded-none disabled:opacity-30"
            >
              −
            </Button>
            <span aria-live="polite" className="w-6 text-center text-sm">
              {line.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Increase quantity"
              onClick={() => {
                setQuantity(line.lineId, line.quantity + 1);
                track("cart_quantity_changed", { productId: line.productId, quantity: line.quantity + 1 });
              }}
              disabled={line.quantity >= (validation?.maxQuantity ?? MAX_CART_LINE_QUANTITY)}
              className="rounded-none disabled:opacity-30"
            >
              +
            </Button>
          </div>

          <div className="flex gap-4 text-xs">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                addToWishlist({
                  productId: line.productId,
                  productSlug: line.productSlug,
                  productName: line.productName,
                  image: line.image,
                  price: { amount: line.unitPriceSnapshot, currency: "INR" },
                  salePrice: line.unitSalePriceSnapshot ? { amount: line.unitSalePriceSnapshot, currency: "INR" } : null,
                });
                removeLine(line.lineId);
                track("wishlist_added", { productId: line.productId });
              }}
              className="h-auto p-0 text-xs text-text-muted hover:text-primary"
            >
              Move to Wishlist
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                removeLine(line.lineId);
                track("remove_from_cart", { productId: line.productId, quantity: line.quantity });
              }}
              className="h-auto p-0 text-xs text-text-muted hover:text-error"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
