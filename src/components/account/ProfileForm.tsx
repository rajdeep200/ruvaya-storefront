"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone } from "lucide-react";
import { profileFormSchema, type ProfileFormValues, type Account } from "@/lib/validation/auth";
import { updateProfile } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { Button } from "@/components/ui/button";

const inputClass =
  "min-h-11 w-full rounded-md border border-border bg-surface px-3 pr-10 text-sm text-text-primary outline-none focus:border-primary";

export function ProfileForm({ account }: { account: Account }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: account.name, phone: account.phone ?? "" },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    setMessage(null);
    try {
      await updateProfile(values);
      setMessage({ text: "Saved.", isError: false });
      router.refresh();
    } catch (error) {
      setMessage({
        text: error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-primary">
          Full name
        </label>
        <div className="relative">
          <input id="name" type="text" autoComplete="name" className={inputClass} {...form.register("name")} />
          <User
            size={16}
            strokeWidth={1.6}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
        </div>
        {form.formState.errors.name && (
          <p role="alert" className="mt-1 text-xs text-error">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text-primary">
          Mobile number
        </label>
        <div className="relative">
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            className={inputClass}
            {...form.register("phone")}
          />
          <Phone
            size={16}
            strokeWidth={1.6}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
        </div>
        {form.formState.errors.phone && (
          <p role="alert" className="mt-1 text-xs text-error">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      {message && <p className={`text-sm ${message.isError ? "text-error" : "text-success"}`}>{message.text}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-auto min-h-12 w-full rounded-md text-sm font-medium tracking-wide uppercase disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
