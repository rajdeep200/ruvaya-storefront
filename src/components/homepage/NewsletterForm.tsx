"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/api/newsletter";
import { track } from "@/lib/analytics/track";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof formSchema>;

type NewsletterFormProps = {
  source: "homepage" | "footer";
};

export function NewsletterForm({ source }: NewsletterFormProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormValues) {
    try {
      const res = await subscribeNewsletter({ email: values.email, source });
      setIsSubscribed(res.subscribed);
      track("newsletter_subscribed", {});
      toast(res.message, { variant: "success" });
      reset();
    } catch {
      toast("We couldn't subscribe you right now. Please try again.", { variant: "error" });
    }
  }

  if (isSubscribed) {
    return <p className="text-sm font-medium text-text-primary">You&apos;re on the list — welcome!</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Enter your email address"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          className="min-h-11 flex-1 rounded-sm border border-border bg-surface px-4 text-sm text-text-primary outline-none focus:border-primary"
          {...register("email")}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-auto min-h-11 shrink-0 rounded-sm px-6 text-sm font-medium tracking-wide uppercase disabled:opacity-60"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
      {errors.email && (
        <p id="newsletter-email-error" role="alert" className="mt-2 text-xs text-error">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
