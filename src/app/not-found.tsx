import Link from "next/link";
import { RuvayaLogo } from "@/components/common/RuvayaLogo";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <RuvayaLogo size={56} />
      <h1 className="mt-6 font-serif text-3xl text-text-primary">Page not found</h1>
      <p className="mt-3 text-sm text-text-secondary">
        The page you&apos;re looking for may have moved, or the link may be out of date. Let&apos;s get you back to
        something beautiful.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
          Back to Home
        </Link>
        <Link href="/kurtis" className="min-h-11 rounded-full border border-border px-6 py-3 text-sm font-medium text-text-primary hover:border-primary">
          Shop All Kurtis
        </Link>
      </div>
    </div>
  );
}
