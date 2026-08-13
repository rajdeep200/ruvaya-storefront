import Image from "next/image";
import Link from "next/link";
import type { HeroSection } from "@/types";

type HeroProps = {
  hero: HeroSection;
};

// Mobile/tablet (below `lg`) get their own crop position, text width and
// heading size — the source image is a wide desktop composition with the
// model on the right and empty space on the left for text; on a narrow
// viewport the default center-crop pulls the model into that text zone.
// Every mobile-only rule below is overridden back to the original value at
// `lg:`, so the desktop layout is provably unchanged.
export function Hero({ hero }: HeroProps) {
  return (
    <section className="relative h-[420px] w-full overflow-hidden sm:h-[520px] lg:h-[640px]">
      <Image
        src={hero.image.url}
        alt={hero.image.alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-[45%_center] lg:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/55 to-transparent lg:from-background/90 lg:via-background/40" />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
        <div className="max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <h1 className="font-serif text-3xl leading-tight tracking-wide text-text-primary uppercase max-lg:text-balance sm:text-4xl lg:text-5xl">
            {hero.heading}
          </h1>
          <p className="mt-4 text-base text-text-secondary">{hero.subheading}</p>
          <Link
            href={hero.ctaHref}
            className="mt-6 inline-block rounded-sm bg-primary px-8 py-3 text-sm font-medium tracking-wide text-white uppercase hover:bg-primary-hover"
          >
            {hero.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
