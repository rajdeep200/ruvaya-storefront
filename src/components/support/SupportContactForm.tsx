"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportContactRequestSchema, type SupportContactRequest } from "@/lib/validation/support";
import { submitSupportContact } from "@/lib/api/support";
import { Button } from "@/components/ui/button";

export function SupportContactForm() {
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SupportContactRequest>({ resolver: zodResolver(supportContactRequestSchema) });

  async function onSubmit(values: SupportContactRequest) {
    setSubmitError(null);
    try {
      const res = await submitSupportContact(values);
      setConfirmation(res.message);
      reset();
    } catch {
      setSubmitError("We couldn't send your message right now. Please try WhatsApp instead.");
    }
  }

  if (confirmation) {
    return (
      <div className="rounded-md border border-success/30 bg-success/5 p-6 text-sm text-text-secondary">
        {confirmation}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="support-name" className="mb-1.5 block text-sm font-medium text-text-primary">
          Name
        </label>
        <input
          id="support-name"
          type="text"
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="support-email" className="mb-1.5 block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="support-email"
          type="email"
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          {...register("email")}
        />
        {errors.email && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="support-order" className="mb-1.5 block text-sm font-medium text-text-primary">
          Order Number (optional)
        </label>
        <input
          id="support-order"
          type="text"
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          {...register("orderNumber")}
        />
      </div>

      <div>
        <label htmlFor="support-message" className="mb-1.5 block text-sm font-medium text-text-primary">
          Message
        </label>
        <textarea
          id="support-message"
          rows={4}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          {...register("message")}
        />
        {errors.message && (
          <p role="alert" className="mt-1 text-xs text-error">
            {errors.message.message}
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
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
