import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductListItem } from "@/types";

export function SimilarProducts({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border pt-10">
      <SectionHeading title="You may also like" />
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} imageSizes="(min-width: 1024px) 22vw, 45vw" />
        ))}
      </div>
    </section>
  );
}
