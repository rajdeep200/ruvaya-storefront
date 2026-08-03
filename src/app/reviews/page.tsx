import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, FilterX } from "lucide-react";
import { getReviews } from "@/lib/api/reviews";
import { getProductBySlug } from "@/lib/api/products";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewsPageControls } from "@/components/reviews/ReviewsPageControls";
import { Button } from "@/components/ui/button";
import type { ReviewSort } from "@/types";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "See what Ruvaya customers are saying — real reviews, fit feedback and customer photos.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; sort?: string; withPhotos?: string; verifiedOnly?: string }>;
}) {
  const { product: productSlug, sort, withPhotos, verifiedOnly } = await searchParams;

  let productId: string | undefined;
  let productName: string | undefined;
  if (productSlug) {
    try {
      const product = await getProductBySlug(productSlug);
      productId = product.id;
      productName = product.name;
    } catch {
      // Unknown product slug in the query string — fall back to sitewide reviews.
    }
  }

  const reviews = await getReviews({
    productId,
    sort: sort as ReviewSort | undefined,
    withPhotosOnly: withPhotos === "true",
    verifiedOnly: verifiedOnly === "true",
  });

  const photoReviews = reviews.reviews.filter((r) => r.images.length > 0);
  const hasActiveFilters = Boolean((sort && sort !== "recent") || withPhotos === "true" || verifiedOnly === "true");
  const clearFiltersHref = productSlug ? `/reviews?product=${productSlug}` : "/reviews";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-text-primary uppercase">
          {productName ? `Reviews for ${productName}` : "Loved by our Ruvaya Girls"}
        </h1>
        <svg width="72" height="14" viewBox="0 0 72 14" className="mx-auto mt-3 text-primary" aria-hidden="true">
          <line x1="0" y1="7" x2="28" y2="7" stroke="currentColor" strokeWidth="1" />
          <path d="M36 2 L40 7 L36 12 L32 7 Z" fill="currentColor" />
          <line x1="44" y1="7" x2="72" y2="7" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <ReviewSummary summary={reviews.summary} layout="stack" />
      </div>

      {photoReviews.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold tracking-wide text-text-primary uppercase">Customer Photos</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {photoReviews.flatMap((r) => r.images).map((img) => (
              <div key={img.id} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <ReviewsPageControls />
      </div>

      <div className="mt-6">
        {reviews.reviews.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-sm">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted text-text-primary">
              <MessageSquare size={32} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-serif text-xl text-text-primary">
              {hasActiveFilters ? "No reviews match these filters" : "No reviews yet"}
            </h2>
            <p className="mt-1.5 max-w-xs text-sm text-text-secondary">
              {hasActiveFilters
                ? "Try removing a filter to see more reviews."
                : "Be the first to share your experience once your order is delivered."}
            </p>
            {hasActiveFilters && (
              <Button asChild variant="outline" className="mt-5 gap-2 rounded-md">
                <Link href={clearFiltersHref}>
                  <FilterX size={16} strokeWidth={1.8} aria-hidden="true" />
                  Clear filters
                </Link>
              </Button>
            )}
          </div>
        ) : (
          reviews.reviews.map((review) => <ReviewCard key={review.id} review={review} showProductName={!productSlug} />)
        )}
      </div>
    </div>
  );
}
