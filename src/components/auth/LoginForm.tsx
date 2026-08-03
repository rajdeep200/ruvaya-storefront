"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormValues } from "@/lib/validation/auth";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Button } from "@/components/ui/button";

const inputClass =
  "min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-primary";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  function goToNext() {
    router.push(nextPath);
    router.refresh();
  }

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await login(values);
      goToNext();
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field id="email" label="Email address" error={form.formState.errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={inputClass} {...form.register("email")} />
        </Field>
        <Field id="password" label="Password" error={form.formState.errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            {...form.register("password")}
          />
        </Field>

        {submitError && (
          <div role="alert" className="rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
            {submitError}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-auto min-h-12 w-full rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleSignInButton onSuccess={goToNext} onError={setSubmitError} />
    </div>
  );
}
