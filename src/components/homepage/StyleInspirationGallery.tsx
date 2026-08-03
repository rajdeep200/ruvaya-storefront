import Image from "next/image";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { InspirationImage } from "@/types";

type StyleInspirationGalleryProps = {
  images: InspirationImage[];
};

export function StyleInspirationGallery({ images }: StyleInspirationGalleryProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading title="Style Inspiration" subtitle="Follow us @ruvaya_ethnicwear" />
      <div className="mt-10 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible lg:grid-cols-7">
        {images.map((item) => (
          <div key={item.id} className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:w-auto">
            <Image
              src={item.image.url}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 128px"
              loading="lazy"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
