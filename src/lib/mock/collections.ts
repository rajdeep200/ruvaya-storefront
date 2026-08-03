import type { CollectionDetail, CollectionSummary } from "@/lib/validation/collection";
import { mockImageUrl, type MockPaletteKey } from "./image";
import { mockProductListItems } from "./products";

type CollectionSeed = {
  slug: string;
  name: string;
  tone: MockPaletteKey;
  description: string;
};

const COLLECTION_SEEDS: CollectionSeed[] = [
  { slug: "everyday-kurtis", name: "Everyday Kurtis", tone: "ivory", description: "Soft, easy kurtis for the days that are just ordinary — and deserve grace anyway." },
  { slug: "office-wear", name: "Office Wear", tone: "sky", description: "Polished, comfortable kurtis built for a full day at your desk." },
  { slug: "cotton-kurtis", name: "Cotton Kurtis", tone: "sage", description: "Breathable pure-cotton kurtis for warm days and easy afternoons." },
  { slug: "festive-kurtis", name: "Festive Kurtis", tone: "rose", description: "A little more embroidery, a little more shine — for the days worth celebrating." },
  { slug: "kurti-sets", name: "Kurti Sets", tone: "peach", description: "Complete kurti, bottom and dupatta sets, thoughtfully paired." },
  { slug: "new-arrivals", name: "New Arrivals", tone: "lavender", description: "The newest additions to the Ruvaya wardrobe." },
  { slug: "best-sellers", name: "Best Sellers", tone: "mustard", description: "The kurtis our customers keep coming back for." },
];

export const mockCollectionSummaries: CollectionSummary[] = COLLECTION_SEEDS.map((seed) => ({
  id: seed.slug,
  slug: seed.slug,
  name: seed.name,
  image: {
    id: `${seed.slug}-card`,
    url: mockImageUrl(seed.name, { tone: seed.tone, w: 480, h: 620 }),
    alt: seed.name,
  },
}));

export function findMockCollectionBySlug(slug: string): CollectionDetail | undefined {
  const seed = COLLECTION_SEEDS.find((s) => s.slug === slug);
  if (!seed) return undefined;

  const products =
    slug === "best-sellers"
      ? mockProductListItems.filter((p) => p.badges.includes("bestseller"))
      : slug === "new-arrivals"
        ? mockProductListItems.filter((p) => p.badges.includes("new"))
        : mockProductListItems.filter((p) => p.collectionSlugs.includes(slug));

  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    description: seed.description,
    heroImage: {
      id: `${seed.slug}-hero`,
      url: mockImageUrl(seed.name, { tone: seed.tone, w: 1600, h: 640 }),
      alt: seed.name,
    },
    seo: {
      title: `${seed.name} | Ruvaya`,
      description: seed.description,
      canonicalPath: `/collections/${seed.slug}`,
    },
    products,
  };
}
