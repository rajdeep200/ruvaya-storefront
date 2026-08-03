import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { CollectionSummary } from "@/types";

type ShopByCollectionProps = {
  collections: CollectionSummary[];
};

export function ShopByCollection({ collections }: ShopByCollectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading title="Shop by Collection" />
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.slug}`} className="group text-center">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-surface-muted">
              <Image
                src={collection.image.url}
                alt={collection.image.alt}
                fill
                sizes="(min-width: 1024px) 16vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-3 text-xs font-medium tracking-[0.12em] text-text-primary uppercase">
              {collection.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
