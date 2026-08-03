"use client";

import Image from "next/image";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { useCartStore, MAX_CART_LINE_QUANTITY } from "@/store/cart";
import { formatInr } from "@/lib/formatting";
import { track } from "@/lib/analytics/track";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const subtotal = lines.reduce(
    (sum, l) => sum + (l.unitSalePriceSnapshot ?? l.unitPriceSnapshot) * l.quantity,
    0,
  );

  return (
    <Drawer open={isOpen} onOpenChange={(open) => (open ? undefined : closeDrawer())} direction="right">
      <DrawerContent className="w-[90vw] max-w-md">
        <VisuallyHidden asChild>
          <DrawerTitle>Your cart</DrawerTitle>
        </VisuallyHidden>

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="font-serif text-xl text-primary">
            Your Cart {lines.length > 0 && `(${lines.length})`}
          </span>
          <DrawerClose asChild>
            <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-md" aria-label="Close cart">
              <X size={20} strokeWidth={1.8} />
            </Button>
          </DrawerClose>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-text-secondary">Your cart is empty.</p>
            <DrawerClose asChild>
              <Button asChild className="rounded-md">
                <Link href="/kurtis">Continue Shopping</Link>
              </Button>
            </DrawerClose>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <li key={line.lineId} className="flex gap-4 border-b border-border py-4 first:pt-0">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    <Image src={line.image.url} alt={line.image.alt} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${line.productSlug}`}
                      onClick={closeDrawer}
                      className="truncate font-serif text-base text-text-primary hover:text-primary"
                    >
                      {line.productName}
                    </Link>
                    <p className="mt-1 text-sm text-text-secondary">
                      {line.colorName} · Size {line.size}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex shrink-0 items-center rounded-full bg-surface-muted">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                          disabled={line.quantity <= 1}
                          className="rounded-full hover:bg-transparent disabled:opacity-30"
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
                          onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                          disabled={line.quantity >= MAX_CART_LINE_QUANTITY}
                          className="rounded-full hover:bg-transparent disabled:opacity-30"
                        >
                          +
                        </Button>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-text-primary">
                        {formatInr((line.unitSalePriceSnapshot ?? line.unitPriceSnapshot) * line.quantity)}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        removeLine(line.lineId);
                        track("remove_from_cart", { productId: line.productId, quantity: line.quantity });
                      }}
                      aria-label={`Remove ${line.productName} from cart`}
                      className="mt-2 h-auto self-end p-0 text-xs text-text-secondary underline hover:text-error"
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm text-text-secondary">
                <span>Subtotal</span>
                <span className="text-base font-semibold text-text-primary">{formatInr(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-text-muted">Shipping and coupons are calculated at checkout.</p>
              <DrawerClose asChild>
                <Button asChild variant="outline" className="w-full rounded-md">
                  <Link href="/cart">View Cart</Link>
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button asChild className="mt-3 w-full rounded-md">
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </DrawerClose>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
