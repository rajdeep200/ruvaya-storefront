import type { Metadata } from "next";
import { getProducts, parseProductSearchParams, type RawSearchParams } from "@/lib/api/products";
import { ProductListingControls } from "@/components/collection/ProductListingControls";
import { ProductGrid } from "@/components/collection/ProductGrid";
import { TrackViewEvent } from "@/components/common/TrackViewEvent";

export const metadata: Metadata = {
  title: "Shop All Kurtis",
  description: "Browse the full Ruvaya kurti collection — everyday, office-wear, cotton, festive and kurti sets.",
  alternates: { canonical: "/kurtis" },
};

export default async function ShopAllPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const query = parseProductSearchParams(resolvedParams);
  const { items, filters, totalItems } = await getProducts(query);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <TrackViewEvent name="collection_view" collectionId="shop-all" />
      <h1 className="font-serif text-3xl text-text-primary uppercase">Shop All Kurtis</h1>
      <p className="mt-2 max-w-xl text-sm text-text-secondary">
        Our full, carefully curated launch collection — {totalItems} kurtis and counting.
      </p>

      <div className="mt-8">
        <ProductListingControls totalItems={totalItems} filterOptions={filters} />
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
