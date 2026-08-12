"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Ruler, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, buildCartLineId } from "@/store/cart";
import { WishlistButton } from "./WishlistButton";
import { SizeGuideDialog } from "./SizeGuideDialog";
import { PriceDisplay } from "./PriceDisplay";
import { track } from "@/lib/analytics/track";
import { useToast } from "@/hooks/useToast";
import type { ProductDetail } from "@/types";

type ProductPurchasePanelProps = {
  product: ProductDetail;
  whatsappNumber: string;
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
};

export function ProductPurchasePanel({
  product,
  whatsappNumber,
  selectedColorId,
  onSelectColor,
}: ProductPurchasePanelProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [attemptedWithoutSize, setAttemptedWithoutSize] = useState(false);

  useEffect(() => {
    setSelectedSize(null);
    setAttemptedWithoutSize(false);
  }, [selectedColorId]);
  const addLine = useCartStore((s) => s.addLine);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const existingLines = useCartStore((s) => s.lines);

  const colorVariant = useMemo(
    () => product.colorVariants.find((cv) => cv.id === selectedColorId) ?? product.colorVariants[0],
    [product.colorVariants, selectedColorId],
  );
  const sizeAvailability = selectedSize
    ? colorVariant.sizes.find((s) => s.size === selectedSize)
    : undefined;

  const canPurchase = product.isAvailable && !!selectedSize && sizeAvailability?.inStock === true;

  function purchaseBlockedReason(): string {
    if (!product.isAvailable) return "This kurti is currently unavailable.";
    if (selectedSize && sizeAvailability && !sizeAvailability.inStock)
      return `Size ${selectedSize} just sold out in ${colorVariant.name}. Please choose another size.`;
    return "Please select a size to continue.";
  }

  let inlineMessage: string | null = null;
  if (!product.isAvailable) {
    inlineMessage = "This kurti is currently unavailable.";
  } else if (selectedSize && sizeAvailability && !sizeAvailability.inStock) {
    inlineMessage = `Size ${selectedSize} just sold out in ${colorVariant.name}. Please choose another size.`;
  } else if (attemptedWithoutSize && !selectedSize) {
    inlineMessage = "Please select a size to continue.";
  }

  function handleSelectSize(size: string) {
    setSelectedSize(size);
    setAttemptedWithoutSize(false);
  }

  function addToCartLine() {
    const existing = existingLines.find(
      (l) => l.lineId === buildCartLineId(product.id, colorVariant.id, selectedSize!),
    );
    addLine({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      image: colorVariant.images[0],
      colorId: colorVariant.id,
      colorName: colorVariant.name,
      colorHex: colorVariant.hex,
      size: selectedSize!,
      unitPriceSnapshot: product.price.amount,
      unitSalePriceSnapshot: product.salePrice?.amount ?? null,
    });
    track("add_to_cart", {
      productId: product.id,
      variantId: colorVariant.id,
      quantity: (existing?.quantity ?? 0) + 1,
      price: product.salePrice?.amount ?? product.price.amount,
    });
  }

  function handleAddToCart() {
    if (!canPurchase) {
      setAttemptedWithoutSize(true);
      toast(purchaseBlockedReason(), { variant: "error" });
      return;
    }
    addToCartLine();
    openDrawer();
  }

  function handleBuyNow() {
    if (!canPurchase) {
      setAttemptedWithoutSize(true);
      toast(purchaseBlockedReason(), { variant: "error" });
      return;
    }
    addToCartLine();
    router.push("/checkout");
  }

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    `Hi Ruvaya! I need help choosing a size for ${product.name}.`,
  )}`;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="min-w-0">
          <h1 className="font-serif text-xl text-text-primary sm:text-2xl">{product.name}</h1>
          <div className="mt-2">
            <PriceDisplay price={product.price} salePrice={product.salePrice} />
          </div>
          {product.inclusiveOfTaxes && <p className="mt-1 text-xs text-text-muted">Inclusive of all taxes</p>}
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl border border-border bg-surface-muted/60 px-4 py-2.5 text-center">
          <div className="flex items-center gap-1">
            <Star
              size={14}
              strokeWidth={1.4}
              fill={product.rating.average > 0 ? "currentColor" : "none"}
              className="text-primary"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-text-primary">{product.rating.average.toFixed(1)}</span>
          </div>
          <p className="text-xs whitespace-nowrap text-text-secondary">
            {product.rating.count} review{product.rating.count === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <p className="text-sm font-medium text-text-primary">Colour: {colorVariant.name}</p>
        <div className="mt-3 flex gap-2">
          {product.colorVariants.map((cv) => (
            <Button
              key={cv.id}
              type="button"
              variant="ghost"
              onClick={() => onSelectColor(cv.id)}
              aria-pressed={cv.id === selectedColorId}
              aria-label={cv.name}
              className={`h-9 w-9 border-2 p-0 ${cv.id === selectedColorId ? "border-primary" : "border-transparent"}`}
            >
              <span className="block h-full w-full rounded-full border border-border" style={{ backgroundColor: cv.hex }} />
            </Button>
          ))}
        </div>

        <div className="my-5 border-t border-border" />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">Size{selectedSize ? `: ${selectedSize}` : ""}</p>
          <SizeGuideDialog
            measurements={product.measurements}
            trigger={
              <Button type="button" variant="link" className="gap-1 text-xs">
                <Ruler size={14} strokeWidth={1.8} aria-hidden="true" />
                Size guide
              </Button>
            }
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {colorVariant.sizes.map((s) => (
            <Button
              key={s.size}
              type="button"
              variant="ghost"
              disabled={!s.inStock}
              onClick={() => handleSelectSize(s.size)}
              aria-pressed={selectedSize === s.size}
              className={`h-auto min-h-11 min-w-11 rounded-md border bg-surface-muted/50 px-3 disabled:opacity-100 ${
                selectedSize === s.size
                  ? "border-primary bg-primary text-white"
                  : s.inStock
                    ? "border-border bg-transparent text-text-primary hover:border-primary"
                    : "border-border text-text-muted"
              }`}
            >
              {s.size}
            </Button>
          ))}
        </div>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_clicked", { productId: product.id })}
        className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-success/20 bg-success/5 p-4"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.75 1.53 5.28L2 22l4.94-1.6a9.86 9.86 0 0 0 5.1 1.4c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.29.49-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.16.28.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.19 1.34.29.14.46.12.63-.07.17-.19.72-.83.91-1.12.19-.29.38-.24.63-.14.25.09 1.6.75 1.87.89.27.14.46.21.53.32.07.11.07.65-.17 1.33z" />
            </svg>
          </span>
          <span className="text-sm font-medium text-success">Need help? Ask us on WhatsApp</span>
        </span>
        <ChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-success" aria-hidden="true" />
      </a>

      {inlineMessage && (
        <p role="alert" className="mt-4 text-sm text-error">
          {inlineMessage}
        </p>
      )}

      <div className="mt-6 hidden gap-3 sm:flex">
        <Button type="button" variant="outline" size="lg" onClick={handleAddToCart} className="min-h-12 flex-1 rounded-sm">
          Add to Cart
        </Button>
        <Button type="button" size="lg" onClick={handleBuyNow} className="min-h-12 flex-1 rounded-sm">
          Buy Now
        </Button>
        <WishlistButton
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          image={product.images[0]}
          price={product.price}
          salePrice={product.salePrice}
          className="static shrink-0 border border-border shadow-none"
        />
      </div>

      {/* Sticky mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-2 border-t border-border bg-surface px-3 py-3 sm:hidden">
        <div className="shrink-0">
          <PriceDisplay price={product.price} salePrice={product.salePrice} variant="compact" />
        </div>
        <Button type="button" variant="outline" onClick={handleAddToCart} className="h-auto min-h-11 flex-1 rounded-sm px-2">
          Add to Cart
        </Button>
        <Button type="button" onClick={handleBuyNow} className="h-auto min-h-11 flex-1 rounded-sm px-2">
          Buy Now
        </Button>
      </div>
    </div>
  );
}
