"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { MoveToCartDialog } from "@/components/product/MoveToCartDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardMedia, CardContent } from "@/components/ui/card";
import { track } from "@/lib/analytics/track";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <EmptyState
          title="Your wishlist is empty"
          description="Save kurtis you love so you can find them again — no account needed."
          action={
            <Button asChild>
              <Link href="/kurtis">Shop All Kurtis</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-2xl text-text-primary uppercase">
        Your Wishlist <span className="text-base font-sans normal-case text-text-secondary">({items.length})</span>
      </h1>
      <p className="mt-1 text-sm text-text-secondary">Looks you love, saved just for you.</p>

      <div className="mt-8 flex flex-col gap-5">
        {items.map((item) => (
          <Card key={item.productId} className="flex-row gap-3 p-3">
            <div className="w-28 shrink-0 self-start sm:w-36">
              <Link href={`/products/${item.productSlug}`} className="block">
                <CardMedia className="aspect-[3/4] overflow-hidden rounded-xl">
                  <Image src={item.image.url} alt={item.image.alt} fill sizes="144px" className="object-cover" />
                </CardMedia>
              </Link>
            </div>

            <CardContent className="flex-1 justify-center gap-1 p-0">
              <Link href={`/products/${item.productSlug}`} className="block">
                <h2 className="text-sm font-medium text-text-primary">{item.productName}</h2>
                <div className="mt-1">
                  <PriceDisplay price={item.price} salePrice={item.salePrice} />
                </div>
              </Link>

              <div className="mt-2.5 flex flex-col gap-2">
                <MoveToCartDialog
                  productId={item.productId}
                  productSlug={item.productSlug}
                  trigger={
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 w-full gap-1.5 rounded-md px-3 text-[11px] tracking-wide uppercase"
                    >
                      <ShoppingBag size={12} strokeWidth={1.8} aria-hidden="true" />
                      Move to Cart
                    </Button>
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    remove(item.productId);
                    track("wishlist_removed", { productId: item.productId });
                  }}
                  aria-label={`Remove ${item.productName} from wishlist`}
                  className="h-7 w-full gap-1.5 rounded-md px-3 text-[11px] tracking-wide uppercase"
                >
                  <Trash2 size={12} strokeWidth={1.8} aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
          <Heart size={28} strokeWidth={1.4} className="text-primary" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-serif text-lg text-text-primary">Love something else?</h2>
        <p className="mt-1 max-w-xs text-sm text-text-secondary">
          Explore our latest collections and find your next favorite.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/kurtis">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
