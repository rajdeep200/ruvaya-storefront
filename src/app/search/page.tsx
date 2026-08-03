import type { Metadata } from "next";
import Link from "next/link";
import { getSearchResults } from "@/lib/api/search";
import { ProductGrid } from "@/components/collection/ProductGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TrackViewEvent } from "@/components/common/TrackViewEvent";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <EmptyState
          title="Search Ruvaya"
          description="Try searching by kurti name, colour, fabric or occasion — cotton, festive, office wear and more."
        />
      </div>
    );
  }

  const results = await getSearchResults(query);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <TrackViewEvent name="search" />
      <h1 className="font-serif text-2xl text-text-primary">
        {results.totalItems > 0
          ? `${results.totalItems} results for "${query}"`
          : `No results for "${query}"`}
      </h1>

      {results.collections.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {results.collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        {results.products.length === 0 ? (
          <EmptyState
            title="No kurtis matched your search"
            description="Try a different colour, fabric or occasion — or browse the full collection."
            action={
              <Link href="/kurtis" className="text-sm font-medium text-primary hover:underline">
                Shop all kurtis
              </Link>
            }
          />
        ) : (
          <ProductGrid products={results.products} />
        )}
      </div>
    </div>
  );
}
