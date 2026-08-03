"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { reviewSubmissionSchema, type ReviewSubmissionValues } from "@/lib/validation/review";
import { submitReview } from "@/lib/api/reviews";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics/track";
import type { ReviewTokenContext } from "@/types";

type ReviewSubmissionFormProps = {
  secureToken: string;
  context: ReviewTokenContext;
  /** Pre-fills the star rating when arriving from the order-detail page's "Rate your experience" widget. */
  initialRating?: number;
};

export function ReviewSubmissionForm({ secureToken, context, initialRating }: ReviewSubmissionFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasStartedRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewSubmissionValues>({
    resolver: zodResolver(reviewSubmissionSchema),
    defaultValues: {
      rating: initialRating ?? 0,
      purchasedSize: context.purchasedSize ?? "",
      displayConsent: true,
    },
  });

  const rating = watch("rating");
  const title = watch("title");
  const text = watch("text");

  useEffect(() => {
    if (hasStartedRef.current || !(rating || title || text)) return;
    hasStartedRef.current = true;
    track("review_started", {});
  }, [rating, title, text]);

  async function onSubmit(values: ReviewSubmissionValues) {
    setSubmitError(null);
    try {
      await submitReview(secureToken, values, []);
      track("review_submitted", {});
      setIsSubmitted(true);
    } catch {
      setSubmitError("We couldn't submit your review right now. Please try again.");
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-md border border-success/30 bg-success/5 p-6 text-center">
        <h2 className="font-serif text-xl text-text-primary">Thank you for your review!</h2>
        <p className="mt-2 text-sm text-text-secondary">
          We&apos;ve received your feedback on {context.productName}. It will appear once our team publishes it.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">Your rating</p>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  onClick={() => field.onChange(star)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  aria-pressed={field.value >= star}
                  className="h-auto p-1"
                >
                  <Star
                    size={28}
                    strokeWidth={1.2}
                    fill={field.value >= star ? "currentColor" : "none"}
                    className="text-primary"
                  />
                </Button>
              ))}
            </div>
          )}
        />
        {errors.rating && (
          <p role="alert" className="mt-1 text-xs text-error">
            Please select a rating.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="review-title" className="mb-1.5 block text-sm font-medium text-text-primary">
          Title
        </label>
        <input
          id="review-title"
          type="text"
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          {...register("title")}
        />
        {errors.title && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="review-text" className="mb-1.5 block text-sm font-medium text-text-primary">
          Details
        </label>
        <textarea
          id="review-text"
          rows={4}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          {...register("text")}
        />
        {errors.text && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.text.message}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-error">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-auto min-h-12 rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
