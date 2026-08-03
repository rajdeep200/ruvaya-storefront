import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : "/";

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-serif text-2xl text-text-primary uppercase">Create Account</h1>
      <p className="mt-1 text-sm text-text-secondary">Sign up to check out and track your orders.</p>
      <div className="mt-8">
        <SignupForm nextPath={nextPath} />
      </div>
      <p className="mt-6 text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-primary underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
