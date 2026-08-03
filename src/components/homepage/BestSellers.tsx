import Link from "next/link";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductListItem } from "@/types";

type BestSellersProps = {
  products: ProductListItem[];
};

export function BestSellers({ products }: BestSellersProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading title="Best Sellers" />
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showBadge={false} imageSizes="(min-width: 1024px) 16vw, 50vw" />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/kurtis"
          className="inline-block rounded-sm border border-primary px-8 py-3 text-sm font-medium tracking-wide text-primary uppercase hover:bg-surface-muted"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
