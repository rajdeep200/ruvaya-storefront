"use client";

import { useMemo, useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import type { ProductDetail } from "@/types";

type ProductDetailInteractiveProps = {
  product: ProductDetail;
  whatsappNumber: string;
};

export function ProductDetailInteractive({ product, whatsappNumber }: ProductDetailInteractiveProps) {
  const [selectedColorId, setSelectedColorId] = useState(product.colorVariants[0].id);

  const colorVariant = useMemo(
    () => product.colorVariants.find((cv) => cv.id === selectedColorId) ?? product.colorVariants[0],
    [product.colorVariants, selectedColorId],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductGallery
        productId={product.id}
        images={colorVariant.images}
        video={product.video}
        productName={product.name}
      />
      <div>
        <ProductPurchasePanel
          product={product}
          whatsappNumber={whatsappNumber}
          selectedColorId={selectedColorId}
          onSelectColor={setSelectedColorId}
        />
      </div>
    </div>
  );
}
