import type { HomepageResponse } from "@/lib/validation/homepage";
import { mockImageUrl } from "./image";
import { mockCollectionSummaries } from "./collections";
import { mockProductListItems } from "./products";

const BESTSELLER_SLUGS = [
  "ivory-floral-a-line-kurti",
  "pastel-pink-embroidered-kurti",
  "sage-green-straight-kurti",
  "lavender-printed-kurti",
  "peach-chikankari-kurti",
  "blue-floral-cotton-kurti",
];

const SHOP_BY_COLLECTION_ORDER = [
  "everyday-kurtis",
  "office-wear",
  "cotton-kurtis",
  "festive-kurtis",
  "new-arrivals",
  "best-sellers",
];

export const mockHomepage: HomepageResponse = {
  hero: {
    heading: "Grace for every day.",
    subheading: "Timeless kurtis for every moment of you.",
    ctaLabel: "Shop Now",
    ctaHref: "/kurtis",
    image: {
      id: "hero",
      url: mockImageUrl("Hero — Grace for every day", { tone: "blush", w: 1800, h: 900 }),
      alt: "Woman in a pink floral Ruvaya kurti standing by a sunlit window",
    },
  },
  shopByCollection: SHOP_BY_COLLECTION_ORDER.map(
    (slug) => mockCollectionSummaries.find((c) => c.slug === slug)!,
  ),
  bestSellers: BESTSELLER_SLUGS.map((slug) => mockProductListItems.find((p) => p.slug === slug)!),
  seasonalCampaign: {
    eyebrow: "New Season Edit",
    title: "Monsoon Cotton Edit",
    subtitle: "Light, breathable and beautiful. Made for the season of calm.",
    ctaLabel: "Explore Collection",
    ctaHref: "/sale/monsoon-cotton-edit",
    image: {
      id: "seasonal-campaign",
      url: mockImageUrl("Monsoon Cotton Edit", { tone: "sky", w: 1400, h: 800 }),
      alt: "Woman seated by a window wearing a soft printed cotton Ruvaya kurti",
    },
  },
  trustItems: [
    {
      id: "fabric",
      icon: "fabric",
      title: "Premium Fabrics",
      description: "Carefully chosen for comfort & elegance",
    },
    {
      id: "handcrafted",
      icon: "handcrafted",
      title: "Ethical & Handcrafted",
      description: "Supporting artisans & traditional craftsmanship",
    },
    {
      id: "returns",
      icon: "returns",
      title: "Easy Returns",
      description: "Hassle-free returns within 7 days",
    },
    {
      id: "shipping",
      icon: "shipping",
      title: "Free Shipping",
      description: "On orders above ₹999 across India",
    },
    {
      id: "secure",
      icon: "secure",
      title: "Secure Payments",
      description: "100% safe & trusted checkout",
    },
  ],
  featuredReviews: [
    {
      id: "review-1",
      quote:
        "Beautiful kurtis and amazing quality! The fabric is so soft and the fit is perfect. Ruvaya is my go-to for everyday wear.",
      name: "Neha S.",
      rating: 5,
    },
    {
      id: "review-2",
      quote:
        "Elegant, comfortable and classy. Loved the prints and how light the fabric is. Perfect for Indian summers!",
      name: "Priyanka M.",
      rating: 5,
    },
    {
      id: "review-3",
      quote: "My new favourite brand! From packaging to the product, everything feels so premium.",
      name: "Aarti K.",
      rating: 5,
    },
  ],
  styleInspiration: Array.from({ length: 7 }, (_, i) => ({
    id: `inspiration-${i + 1}`,
    image: {
      id: `inspiration-${i + 1}`,
      url: mockImageUrl(`Style Inspiration ${i + 1}`, {
        tone: (["blush", "lavender", "ivory", "mustard", "rose", "sky", "sage"] as const)[i],
        w: 500,
        h: 650,
      }),
      alt: `Ruvaya customer styling, look ${i + 1}`,
    },
  })),
  newsletterHeading: "Be part of the Ruvaya family",
  newsletterSubtext: "Get early access to new arrivals, special offers & style tips.",
  whatsappHeading: "Join on WhatsApp",
  whatsappSubtext: "Get updates & exclusive offers.",
};
