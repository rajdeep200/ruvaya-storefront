import Image from "next/image";
import Link from "next/link";
import type { SeasonalCampaignBanner as SeasonalCampaignBannerType } from "@/types";

type SeasonalCampaignBannerProps = {
  campaign: SeasonalCampaignBannerType;
};

export function SeasonalCampaignBanner({ campaign }: SeasonalCampaignBannerProps) {
  return (
    <section className="bg-surface-muted">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-14 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-text-secondary uppercase">
            {campaign.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-text-primary uppercase sm:text-4xl">
            {campaign.title}
          </h2>
          <p className="mt-4 max-w-sm text-sm text-text-secondary">{campaign.subtitle}</p>
          <Link
            href={campaign.ctaHref}
            className="mt-6 inline-block rounded-sm bg-primary px-8 py-3 text-sm font-medium tracking-wide text-white uppercase hover:bg-primary-hover"
          >
            {campaign.ctaLabel}
          </Link>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-md">
          <Image src={campaign.image.url} alt={campaign.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
