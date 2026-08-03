import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getReviewTokenContext } from "@/lib/api/reviews";
import { AuthExpiredError } from "@/lib/api/errors";
import { ReviewSubmissionForm } from "@/components/reviews/ReviewSubmissionForm";
import { EmptyState } from "@/components/common/EmptyState";
import type { ReviewTokenContext } from "@/types";

export const metadata: Metadata = {
  title: "Write a Review",
  robots: { index: false, follow: false },
};

async function loadContext(secureToken: string): Promise<ReviewTokenContext> {
  try {
    return await getReviewTokenContext(secureToken);
  } catch (error) {
    if (error instanceof AuthExpiredError) {
      return { isValid: false, alreadySubmitted: false };
    }
    throw error;
  }
}

export default async function ReviewSubmissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ secureToken: string }>;
  searchParams: Promise<{ rating?: string }>;
}) {
  const { secureToken } = await params;
  const { rating } = await searchParams;
  const parsedRating = Number(rating);
  const initialRating = Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5 ? parsedRating : undefined;
  const context = await loadContext(secureToken);

  if (!context.isValid) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <EmptyState
          title="This review link has expired"
          description="Review links are only valid for a limited time after delivery. If you'd still like to share feedback, please contact our support team."
          action={
            <Link href="/help" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
              Contact Support
            </Link>
          }
        />
      </div>
    );
  }

  if (context.alreadySubmitted) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <EmptyState
          title="You've already reviewed this order"
          description="Thank you for sharing your feedback with us — you can browse more reviews from the Ruvaya community below."
          action={
            <Link href="/reviews" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
              See All Reviews
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-serif text-2xl text-text-primary uppercase">Write a Review</h1>
      {context.productName && (
        <div className="mt-4 flex items-center gap-3 rounded-md border border-border p-3">
          {context.productImage && (
            <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-surface-muted">
              <Image src={context.productImage.url} alt={context.productImage.alt} fill sizes="48px" className="object-cover" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">{context.productName}</p>
            {context.orderNumber && <p className="text-xs text-text-muted">Order {context.orderNumber}</p>}
          </div>
        </div>
      )}

      <div className="mt-6">
        <ReviewSubmissionForm secureToken={secureToken} context={context} initialRating={initialRating} />
      </div>
    </div>
  );
}
