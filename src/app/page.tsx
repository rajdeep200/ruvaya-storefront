import type { Metadata } from "next";
import { getHomepage, getStorefrontConfig } from "@/lib/api/storefront";
import { Hero } from "@/components/homepage/Hero";
import { ShopByCollection } from "@/components/homepage/ShopByCollection";
import { BestSellers } from "@/components/homepage/BestSellers";
import { SeasonalCampaignBanner } from "@/components/homepage/SeasonalCampaignBanner";
import { TrustStrip } from "@/components/homepage/TrustStrip";
import { ReviewsSection } from "@/components/homepage/ReviewsSection";
import { StyleInspirationGallery } from "@/components/homepage/StyleInspirationGallery";
import { NewsletterWhatsappBand } from "@/components/homepage/NewsletterWhatsappBand";
import { TrackViewEvent } from "@/components/common/TrackViewEvent";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [homepage, storefrontConfig] = await Promise.all([getHomepage(), getStorefrontConfig()]);

  return (
    <>
      <TrackViewEvent name="homepage_view" />

      <Hero hero={homepage.hero} />

      {homepage.shopByCollection.length > 0 && (
        <ShopByCollection collections={homepage.shopByCollection} />
      )}

      {homepage.bestSellers.length > 0 && <BestSellers products={homepage.bestSellers} />}

      {homepage.seasonalCampaign && <SeasonalCampaignBanner campaign={homepage.seasonalCampaign} />}

      {homepage.trustItems.length > 0 && <TrustStrip items={homepage.trustItems} />}

      {homepage.featuredReviews.length > 0 && <ReviewsSection reviews={homepage.featuredReviews} />}

      {homepage.styleInspiration.length > 0 && (
        <StyleInspirationGallery images={homepage.styleInspiration} />
      )}

      <NewsletterWhatsappBand
        newsletterHeading={homepage.newsletterHeading}
        newsletterSubtext={homepage.newsletterSubtext}
        whatsappHeading={homepage.whatsappHeading}
        whatsappSubtext={homepage.whatsappSubtext}
        whatsappNumber={storefrontConfig.whatsappNumber}
      />
    </>
  );
}
