import type { Metadata } from "next";
import Image from "next/image";
import { mockImageUrl } from "@/lib/mock/image";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Ruvaya is a pan-India kurti brand built on careful curation, honest fit information and everyday grace.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <Image
          src={mockImageUrl("Our Story", { tone: "blush", w: 1800, h: 700 })}
          alt="A Ruvaya kurti styled simply, in natural light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-serif text-3xl text-text-primary uppercase">Our Story</h1>

        <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-text-secondary">
          <p>
            Ruvaya began with a simple frustration — finding a kurti that felt considered, not just available.
            Fabric that breathed. A fit that was honestly described. Prints that felt graceful rather than loud.
          </p>
          <p>
            We&apos;re a small, focused catalogue by design. Rather than chasing volume, we spend our time on fewer
            styles, chosen carefully — everyday cottons, office-ready silhouettes, and festive pieces worth keeping
            for years, not one season.
          </p>
          <p>
            Every product page carries the details we&apos;d want to know ourselves before buying online: actual
            garment measurements, fabric composition, fit notes, and what size the model is wearing. We&apos;d rather
            tell you a kurti runs slightly large than have it arrive as a surprise.
          </p>
          <p>
            We&apos;re still early, and still learning. If something about your order isn&apos;t right, we want to
            hear about it — reach us any time on WhatsApp or through our{" "}
            <a href="/help" className="font-medium text-primary hover:underline">
              Help
            </a>{" "}
            page.
          </p>
          <p className="text-text-primary">— The Ruvaya Team</p>
        </div>
      </div>
    </div>
  );
}
