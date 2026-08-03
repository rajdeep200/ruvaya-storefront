"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist";
import { track } from "@/lib/analytics/track";
import type { ImageAsset, Money } from "@/types";

type WishlistButtonProps = {
  productId: string;
  productSlug: string;
  productName: string;
  image: ImageAsset;
  price: Money;
  salePrice: Money | null;
  className?: string;
};

export function WishlistButton({
  productId,
  productSlug,
  productName,
  image,
  price,
  salePrice,
  className,
}: WishlistButtonProps) {
  const isSaved = useWishlistStore((s) => s.isInWishlist(productId));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={(e) => {
        e.preventDefault();
        toggle({ productId, productSlug, productName, image, price, salePrice });
        track(isSaved ? "wishlist_removed" : "wishlist_added", { productId, price: salePrice?.amount ?? price.amount });
      }}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      className={`bg-white/90 shadow-sm hover:bg-white/90 ${className ?? ""}`}
    >
      <Heart
        size={18}
        strokeWidth={1.6}
        fill={isSaved ? "currentColor" : "none"}
        className={isSaved ? "text-primary" : ""}
        aria-hidden="true"
      />
    </Button>
  );
}
