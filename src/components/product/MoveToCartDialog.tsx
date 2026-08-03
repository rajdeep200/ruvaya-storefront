"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/api/products";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToast } from "@/hooks/useToast";
import { track } from "@/lib/analytics/track";
import type { ProductDetail } from "@/types";

type MoveToCartDialogProps = {
  productSlug: string;
  productId: string;
  trigger: React.ReactNode;
};

export function MoveToCartDialog({ productSlug, productId, trigger }: MoveToCartDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [colorId, setColorId] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const addLine = useCartStore((s) => s.addLine);
  const removeWishlistItem = useWishlistStore((s) => s.remove);
  const { toast } = useToast();

  async function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open && !product) {
      setIsLoading(true);
      try {
        const detail = await getProductBySlug(productSlug);
        setProduct(detail);
        setColorId(detail.colorVariants[0].id);
      } catch {
        toast("We couldn't load this kurti right now.", { variant: "error" });
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const colorVariant = product?.colorVariants.find((cv) => cv.id === colorId) ?? product?.colorVariants[0];
  const sizeAvailability = size ? colorVariant?.sizes.find((s) => s.size === size) : undefined;
  const canConfirm = !!colorVariant && !!size && sizeAvailability?.inStock;

  function handleConfirm() {
    if (!product || !colorVariant || !size || !canConfirm) {
      setAttempted(true);
      return;
    }
    addLine({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      image: colorVariant.images[0],
      colorId: colorVariant.id,
      colorName: colorVariant.name,
      colorHex: colorVariant.hex,
      size,
      unitPriceSnapshot: product.price.amount,
      unitSalePriceSnapshot: product.salePrice?.amount ?? null,
    });
    removeWishlistItem(productId);
    track("add_to_cart", { productId: product.id, variantId: colorVariant.id, quantity: 1 });
    toast(`${product.name} moved to your cart.`, { variant: "success" });
    setIsOpen(false);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface p-6 shadow-xl focus:outline-none">
          <VisuallyHidden asChild>
            <Dialog.Title>Choose colour and size</Dialog.Title>
          </VisuallyHidden>
          {isLoading || !product || !colorVariant ? (
            <p className="py-8 text-center text-sm text-text-secondary">Loading options...</p>
          ) : (
            <>
              <p className="mb-4 font-serif text-lg text-text-primary">{product.name}</p>

              <p className="mb-2 text-sm font-medium text-text-primary">Colour: {colorVariant.name}</p>
              <div className="mb-4 flex gap-2">
                {product.colorVariants.map((cv) => (
                  <Button
                    key={cv.id}
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setColorId(cv.id);
                      setSize(null);
                    }}
                    aria-pressed={cv.id === colorVariant.id}
                    className={`h-8 w-8 border-2 p-0 ${cv.id === colorVariant.id ? "border-primary" : "border-transparent"}`}
                  >
                    <span className="block h-full w-full rounded-full border border-border" style={{ backgroundColor: cv.hex }} />
                  </Button>
                ))}
              </div>

              <p className="mb-2 text-sm font-medium text-text-primary">Size</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {colorVariant.sizes.map((s) => (
                  <Button
                    key={s.size}
                    type="button"
                    variant="ghost"
                    disabled={!s.inStock}
                    onClick={() => {
                      setSize(s.size);
                      setAttempted(false);
                    }}
                    aria-pressed={size === s.size}
                    className={`h-auto min-h-10 min-w-10 rounded-md border bg-surface-muted/50 px-3 disabled:opacity-100 ${
                      size === s.size
                        ? "border-primary bg-primary text-white"
                        : s.inStock
                          ? "border-border bg-transparent text-text-primary"
                          : "border-border text-text-muted"
                    }`}
                  >
                    {s.size}
                  </Button>
                ))}
              </div>

              {attempted && !canConfirm && (
                <p role="alert" className="mb-3 text-xs text-error">
                  Please select a size to continue.
                </p>
              )}

              <Button type="button" onClick={handleConfirm} className="h-auto min-h-11 w-full rounded-sm">
                Add to Cart
              </Button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
