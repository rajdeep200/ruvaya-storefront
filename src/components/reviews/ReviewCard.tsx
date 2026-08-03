import Image from "next/image";
import { StarRating } from "./StarRating";
import { formatDate } from "@/lib/formatting";
import type { Review } from "@/types";

const FIT_LABEL: Record<string, string> = {
  runs_small: "Runs small",
  true_to_size: "True to size",
  runs_large: "Runs large",
};

type ReviewCardProps = {
  review: Review;
  showProductName?: boolean;
};

export function ReviewCard({ review, showProductName = false }: ReviewCardProps) {
  return (
    <article className="border-b border-border py-6 first:pt-0">
      <div className="flex items-center justify-between gap-3">
        <StarRating rating={review.rating} />
        {review.isVerifiedPurchase && (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
            Verified Purchase
          </span>
        )}
      </div>

      <h3 className="mt-2 text-sm font-semibold text-text-primary">{review.title}</h3>
      {showProductName && <p className="text-xs text-text-muted">{review.productName}</p>}
      <p className="mt-1 text-sm text-text-secondary">{review.text}</p>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted">
        <span>{review.customerName}</span>
        <span aria-hidden="true">·</span>
        <span>{formatDate(review.createdAt)}</span>
        {review.purchasedSize && (
          <>
            <span aria-hidden="true">·</span>
            <span>Purchased size {review.purchasedSize}</span>
          </>
        )}
        {review.fitFeedback && (
          <>
            <span aria-hidden="true">·</span>
            <span>{FIT_LABEL[review.fitFeedback]}</span>
          </>
        )}
      </div>

      {review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((img) => (
            <div key={img.id} className="relative h-16 w-16 overflow-hidden rounded-md bg-surface-muted">
              <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {review.adminReply && (
        <div className="mt-3 rounded-md bg-surface-muted p-3 text-sm text-text-secondary">
          <p className="mb-1 text-xs font-semibold tracking-wide text-text-primary uppercase">Ruvaya Team</p>
          {review.adminReply}
        </div>
      )}
    </article>
  );
}
