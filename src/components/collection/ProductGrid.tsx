import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { ProductListItem } from "@/types";

type ProductGridProps = {
  products: ProductListItem[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No kurtis match these filters"
        description="Try removing a filter or two — or explore the full collection instead."
        action={
          <Link href="/kurtis" className="text-sm font-medium text-primary hover:underline">
            Clear filters and shop all kurtis
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} imageSizes="(min-width: 1024px) 22vw, 45vw" />
      ))}
    </div>
  );
}
