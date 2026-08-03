"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackOrderRequestSchema, type TrackOrderRequest } from "@/lib/validation/order";
import { trackOrder } from "@/lib/api/orders";
import { NotFoundApiError } from "@/lib/api/errors";
import { track } from "@/lib/analytics/track";
import { Button } from "@/components/ui/button";

export function TrackOrderForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackOrderRequest>({ resolver: zodResolver(trackOrderRequestSchema) });

  async function onSubmit(values: TrackOrderRequest) {
    setServerError(null);
    try {
      const res = await trackOrder(values);
      track("track_order", {});
      router.push(`/orders/${res.secureToken}`);
    } catch (error) {
      if (error instanceof NotFoundApiError) {
        setServerError(
          "We couldn't find an order matching those details. Please double-check your order number and phone/email.",
        );
      } else {
        setServerError("Something went wrong. Please try again in a moment.");
      }
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-sm">
      <div className="mb-4">
        <label htmlFor="orderNumber" className="mb-1.5 block text-sm font-medium text-text-primary">
          Order Number
        </label>
        <input
          id="orderNumber"
          type="text"
          placeholder="e.g. RUV10234"
          aria-invalid={!!errors.orderNumber}
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          {...register("orderNumber")}
        />
        {errors.orderNumber && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.orderNumber.message}
          </p>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-text-primary">
          Phone Number or Email
        </label>
        <input
          id="contact"
          type="text"
          placeholder="Used at checkout"
          aria-invalid={!!errors.contact}
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          {...register("contact")}
        />
        {errors.contact && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.contact.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="mb-4 text-sm text-error">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-auto min-h-12 w-full rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-60"
      >
        {isSubmitting ? "Looking up your order..." : "Track Order"}
      </Button>
    </form>
  );
}
