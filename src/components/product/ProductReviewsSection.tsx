import Link from "next/link";
import { Star, MessageSquare, ArrowRight } from "lucide-react";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import type { ReviewListResponse } from "@/types";

type ProductReviewsSectionProps = {
  reviews: ReviewListResponse;
  productSlug: string;
};

export function ProductReviewsSection({ reviews, productSlug }: ProductReviewsSectionProps) {
  return (
    <section className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <h2 className="text-center font-serif text-2xl tracking-wide text-text-primary uppercase">
        Customer Reviews
      </h2>
      <div className="my-4 flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-16 bg-border" />
        <Star size={16} strokeWidth={1.6} className="text-secondary" />
        <span className="h-px w-16 bg-border" />
      </div>

      <ReviewSummary summary={reviews.summary} layout="stack" />

      {reviews.reviews.length === 0 ? (
        <div className="mt-8 flex flex-col items-center border-t border-border pt-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted text-text-primary">
            <MessageSquare size={32} strokeWidth={1.4} aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-serif text-xl text-text-primary">No reviews yet for this kurti</h3>
          <p className="mt-1.5 max-w-xs text-sm text-text-secondary">
            Be the first to share your experience once your order is delivered.
          </p>
        </div>
      ) : (
        <div className="mt-8 border-t border-border pt-8">
          {reviews.reviews.slice(0, 4).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <Button asChild variant="outline" className="mt-6 w-full gap-2 rounded-md">
        <Link href={`/reviews?product=${productSlug}`}>
          See all reviews
          <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </Button>
    </section>
  );
}
