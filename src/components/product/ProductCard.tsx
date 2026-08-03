import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { WishlistButton } from "./WishlistButton";
import { PriceDisplay } from "./PriceDisplay";
import { MoveToCartDialog } from "./MoveToCartDialog";
import { Card, CardMedia, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductListItem } from "@/types";

const BADGE_LABEL: Record<string, string> = {
  new: "New",
  bestseller: "Bestseller",
  sale: "Sale",
};

type ProductCardProps = {
  product: ProductListItem;
  showBadge?: boolean;
  imageSizes?: string;
};

export function ProductCard({ product, showBadge = true, imageSizes = "(min-width: 1024px) 25vw, 50vw" }: ProductCardProps) {
  const badge = showBadge ? product.badges[0] : undefined;

  return (
    <Card className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <CardMedia className="aspect-[5/6] overflow-hidden rounded-t-2xl">
          <Image
            src={product.primaryImage.url}
            alt={product.primaryImage.alt}
            fill
            sizes={imageSizes}
            className={`object-cover transition-opacity ${product.hoverImage ? "group-hover:opacity-0" : ""}`}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage.url}
              alt=""
              fill
              sizes={imageSizes}
              className="absolute inset-0 object-cover opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          )}
          {badge && (
            <Badge variant="secondary" className="absolute left-3 top-3 shadow-sm">
              {BADGE_LABEL[badge]}
            </Badge>
          )}
          {!product.isAvailable && (
            <span className="absolute inset-x-0 bottom-0 bg-text-primary/85 py-1.5 text-center text-[11px] font-medium tracking-wide text-white uppercase">
              Sold Out
            </span>
          )}
        </CardMedia>
      </Link>
      <WishlistButton
        productId={product.id}
        productSlug={product.slug}
        productName={product.name}
        image={product.primaryImage}
        price={product.price}
        salePrice={product.salePrice}
        className="absolute right-2.5 top-2.5 h-9 w-9 shadow-sm"
      />

      <CardContent className="gap-0 px-3 py-2.5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="truncate font-serif text-sm text-text-primary">{product.name}</h3>
          <p className="mt-0.5 truncate text-[11px] text-text-secondary">
            {product.fabric} {product.category}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <PriceDisplay price={product.price} salePrice={product.salePrice} />
            {product.colors.length > 1 && (
              <div className="flex gap-1" aria-label={`Available in ${product.colors.length} colours`}>
                {product.colors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="h-2.5 w-2.5 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        <MoveToCartDialog
          productId={product.id}
          productSlug={product.slug}
          trigger={
            <Button
              type="button"
              size="sm"
              disabled={!product.isAvailable}
              className="mt-2 w-full text-xs disabled:opacity-60"
            >
              {product.isAvailable ? "Add to Bag" : "Sold Out"}
              {product.isAvailable && <ShoppingBag size={14} strokeWidth={1.8} aria-hidden="true" />}
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
