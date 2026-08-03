"use client";

import { useEffect } from "react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { useRecentlyViewedStore } from "@/store/recentlyViewed";
import type { ProductListItem } from "@/types";

/** Adds the current product to the recently-viewed store; renders nothing itself. */
export function TrackRecentlyViewed({ product }: { product: ProductListItem }) {
  const addItem = useRecentlyViewedStore((s) => s.addItem);
  useEffect(() => {
    addItem(product);
  }, [product, addItem]);
  return null;
}

export function RecentlyViewedList({ excludeProductId }: { excludeProductId?: string }) {
  const items = useRecentlyViewedStore((s) => s.items).filter((i) => i.id !== excludeProductId);

  if (items.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border pt-10">
      <SectionHeading title="Recently Viewed" />
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} imageSizes="(min-width: 1024px) 22vw, 45vw" />
        ))}
      </div>
    </section>
  );
}
