import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : "/";

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-serif text-2xl text-text-primary uppercase">Login</h1>
      <p className="mt-1 text-sm text-text-secondary">Sign in to continue.</p>
      <div className="mt-8">
        <LoginForm nextPath={nextPath} />
      </div>
      <p className="mt-6 text-sm text-text-secondary">
        New to Ruvaya?{" "}
        <Link
          href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-primary underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
