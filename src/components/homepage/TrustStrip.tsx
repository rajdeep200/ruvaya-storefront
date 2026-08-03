import type { TrustItem } from "@/types";

type TrustStripProps = {
  items: TrustItem[];
};

export function TrustStrip({ items }: TrustStripProps) {
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-border">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center px-2 text-center lg:px-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative
                brand icon swapped by editing public/assets/icons/*.svg directly;
                no benefit from next/image's raster optimization pipeline here. */}
            <img src={`/assets/icons/${item.icon}.svg`} alt="" width={30} height={30} />
            <p className="mt-3 text-xs font-semibold tracking-wide text-text-primary uppercase">{item.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
