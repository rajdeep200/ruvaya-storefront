import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/api/campaigns";
import { NotFoundApiError } from "@/lib/api/errors";
import { ProductGrid } from "@/components/collection/ProductGrid";
import { Countdown } from "@/components/common/Countdown";
import { EmptyState } from "@/components/common/EmptyState";
import { TrackViewEvent } from "@/components/common/TrackViewEvent";
import type { Campaign } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const campaign = await getCampaignBySlug(slug);
    return {
      title: campaign.seo?.title ?? campaign.title,
      description: campaign.seo?.description ?? campaign.subtitle,
      alternates: { canonical: campaign.seo?.canonicalPath ?? `/sale/${slug}` },
    };
  } catch {
    return { title: "Sale" };
  }
}

async function loadCampaign(slug: string): Promise<Campaign> {
  try {
    return await getCampaignBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundApiError) notFound();
    throw error;
  }
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await loadCampaign(slug);

  return (
    <div>
      <TrackViewEvent name="collection_view" collectionId={`campaign:${campaign.id}`} metadata={{ campaign: campaign.slug }} />

      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <Image src={campaign.bannerImage.url} alt={campaign.bannerImage.alt} fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-3xl text-text-primary uppercase">{campaign.title}</h1>
        {campaign.subtitle && <p className="mt-2 max-w-xl text-sm text-text-secondary">{campaign.subtitle}</p>}

        {campaign.status === "expired" ? (
          <div className="mt-10">
            <EmptyState
              title="This sale has ended"
              description="But there's always something new — explore the full Ruvaya collection."
              action={
                <Link href="/kurtis" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
                  Shop All Kurtis
                </Link>
              }
            />
          </div>
        ) : campaign.status === "upcoming" ? (
          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-text-primary">This sale hasn&apos;t started yet.</p>
            {campaign.showCountdown && <Countdown target={campaign.startAt} />}
          </div>
        ) : (
          <>
            {campaign.showCountdown && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium tracking-wide text-text-muted uppercase">Sale ends in</p>
                <Countdown target={campaign.endAt} />
              </div>
            )}

            {campaign.couponCode && (
              <p className="mt-6 rounded-md bg-surface-muted px-4 py-3 text-sm text-text-primary">
                Use code <span className="font-semibold">{campaign.couponCode}</span> at checkout.
              </p>
            )}

            {campaign.terms.length > 0 && (
              <ul className="mt-4 flex flex-col gap-1 text-xs text-text-muted">
                {campaign.terms.map((term) => (
                  <li key={term}>· {term}</li>
                ))}
              </ul>
            )}

            <div className="mt-10">
              <ProductGrid products={campaign.products} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
