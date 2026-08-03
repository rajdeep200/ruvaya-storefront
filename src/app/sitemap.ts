import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { getProducts } from "@/lib/api/products";
import { getCollections } from "@/lib/api/collections";
import { getActiveCampaigns } from "@/lib/api/campaigns";

const STATIC_PATHS = [
  "/",
  "/kurtis",
  "/about",
  "/help",
  "/size-guide",
  "/reviews",
  "/track-order",
  "/shipping-policy",
  "/return-refund-policy",
  "/cancellation-policy",
  "/privacy-policy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ items: products }, collections, campaigns] = await Promise.all([
    getProducts(),
    getCollections(),
    getActiveCampaigns(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${env.siteUrl}${path}`,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${env.siteUrl}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${env.siteUrl}/collections/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const campaignEntries: MetadataRoute.Sitemap = campaigns.map((c) => ({
    url: `${env.siteUrl}/sale/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries, ...collectionEntries, ...campaignEntries];
}
