import type { Campaign } from "@/lib/validation/campaign";
import { mockImageUrl } from "./image";
import { mockProductListItems } from "./products";

const cottonProducts = mockProductListItems.filter((p) => p.collectionSlugs.includes("cotton-kurtis"));
const festiveProducts = mockProductListItems.filter((p) => p.collectionSlugs.includes("festive-kurtis"));

export const mockCampaigns: Campaign[] = [
  {
    id: "monsoon-cotton-edit",
    slug: "monsoon-cotton-edit",
    title: "Monsoon Cotton Edit",
    subtitle: "Light, breathable and beautiful. Made for the season of calm.",
    bannerImage: {
      id: "monsoon-cotton-edit-banner",
      url: mockImageUrl("Monsoon Cotton Edit", { tone: "sky", w: 1800, h: 700 }),
      alt: "Monsoon Cotton Edit campaign banner",
    },
    startAt: "2026-06-01T00:00:00.000Z",
    endAt: "2026-08-31T23:59:59.000Z",
    showCountdown: false,
    status: "active",
    terms: [
      "Valid on select cotton kurtis while stocks last.",
      "Cannot be combined with other offers.",
      "Standard return and exchange policy applies.",
    ],
    seo: {
      title: "Monsoon Cotton Edit | Ruvaya",
      description: "Light, breathable cotton kurtis for the monsoon season.",
      canonicalPath: "/sale/monsoon-cotton-edit",
    },
    products: cottonProducts,
  },
  {
    id: "diwali-sale",
    slug: "diwali-sale",
    title: "Diwali Sale",
    subtitle: "Festive kurtis to light up the season.",
    bannerImage: {
      id: "diwali-sale-banner",
      url: mockImageUrl("Diwali Sale", { tone: "rose", w: 1800, h: 700 }),
      alt: "Diwali Sale campaign banner",
    },
    startAt: "2026-10-15T00:00:00.000Z",
    endAt: "2026-11-05T23:59:59.000Z",
    showCountdown: true,
    status: "upcoming",
    terms: ["Sale begins 15 October. Set a reminder — we'll see you then."],
    seo: {
      title: "Diwali Sale | Ruvaya",
      description: "Festive kurtis for Diwali, coming soon.",
      canonicalPath: "/sale/diwali-sale",
    },
    products: festiveProducts,
  },
  {
    id: "summer-kurti-sale",
    slug: "summer-kurti-sale",
    title: "Summer Kurti Sale",
    subtitle: "Cool, breathable kurtis for the warmest days.",
    bannerImage: {
      id: "summer-kurti-sale-banner",
      url: mockImageUrl("Summer Kurti Sale", { tone: "mustard", w: 1800, h: 700 }),
      alt: "Summer Kurti Sale campaign banner",
    },
    startAt: "2026-03-01T00:00:00.000Z",
    endAt: "2026-05-31T23:59:59.000Z",
    showCountdown: false,
    status: "expired",
    terms: ["This sale has ended."],
    seo: {
      title: "Summer Kurti Sale | Ruvaya",
      description: "This seasonal sale has ended.",
      canonicalPath: "/sale/summer-kurti-sale",
    },
    products: [],
  },
];

export function findMockCampaignBySlug(slug: string): Campaign | undefined {
  return mockCampaigns.find((c) => c.slug === slug);
}
