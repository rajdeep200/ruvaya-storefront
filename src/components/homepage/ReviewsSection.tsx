import { SectionHeading } from "@/components/common/SectionHeading";
import { StarRating } from "@/components/reviews/StarRating";
import type { FeaturedReview } from "@/types";

type ReviewsSectionProps = {
  reviews: FeaturedReview[];
};

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading title="Loved by our Ruvaya girls" />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {reviews.map((review) => (
          <figure key={review.id} className="rounded-md bg-surface-muted p-6">
            <span aria-hidden="true" className="font-serif text-3xl leading-none text-primary">
              &ldquo;
            </span>
            <blockquote className="mt-2 font-serif text-[15px] leading-relaxed text-text-primary italic">
              {review.quote}
            </blockquote>
            <figcaption className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">— {review.name}</span>
              <StarRating rating={review.rating} />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
