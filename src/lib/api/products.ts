import { env } from "@/config/env";
import { apiFetch } from "./client";
import { NotFoundApiError } from "./errors";
import {
  productDetailSchema,
  productDetailToListItem,
  productListResponseSchema,
  type ProductSort,
} from "@/lib/validation/product";
import { mockDelay } from "@/lib/mock/delay";
import { findMockProductBySlug, mockProducts, mockProductListItems } from "@/lib/mock/products";

export type ProductQueryParams = {
  collectionSlug?: string;
  sort?: ProductSort;
  sizes?: string[];
  colors?: string[];
  fabrics?: string[];
  occasions?: string[];
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function parseArrayParam(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  const joined = Array.isArray(value) ? value.join(",") : value;
  const values = joined.split(",").filter(Boolean);
  return values.length > 0 ? values : undefined;
}

/** Shared by /kurtis and /collections/[slug] so both pages read the same shareable query-string shape. */
export function parseProductSearchParams(searchParams: RawSearchParams): ProductQueryParams {
  const sortValue = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
  const priceMinValue = Array.isArray(searchParams.priceMin) ? searchParams.priceMin[0] : searchParams.priceMin;
  const priceMaxValue = Array.isArray(searchParams.priceMax) ? searchParams.priceMax[0] : searchParams.priceMax;

  return {
    sort: (sortValue as ProductSort | undefined) ?? "newest",
    sizes: parseArrayParam(searchParams.sizes),
    colors: parseArrayParam(searchParams.colors),
    fabrics: parseArrayParam(searchParams.fabrics),
    occasions: parseArrayParam(searchParams.occasions),
    priceMin: priceMinValue ? Number(priceMinValue) : undefined,
    priceMax: priceMaxValue ? Number(priceMaxValue) : undefined,
  };
}

function applyMockFilters(params: ProductQueryParams) {
  let items = params.collectionSlug
    ? mockProductListItems.filter((p) => {
        if (params.collectionSlug === "best-sellers") return p.badges.includes("bestseller");
        if (params.collectionSlug === "new-arrivals") return p.badges.includes("new");
        return p.collectionSlugs.includes(params.collectionSlug!);
      })
    : [...mockProductListItems];

  if (params.sizes?.length) {
    const wanted = new Set(params.sizes.map((s) => s.toUpperCase()));
    const slugsWithSize = new Set(
      mockProducts
        .filter((p) => p.colorVariants.some((cv) => cv.sizes.some((s) => s.inStock && wanted.has(s.size))))
        .map((p) => p.slug),
    );
    items = items.filter((p) => slugsWithSize.has(p.slug));
  }
  if (params.colors?.length) {
    const wanted = new Set(params.colors.map((c) => c.toLowerCase()));
    items = items.filter((p) => p.colors.some((c) => wanted.has(c.name.toLowerCase())));
  }
  if (params.fabrics?.length) {
    const wanted = new Set(params.fabrics.map((f) => f.toLowerCase()));
    items = items.filter((p) => wanted.has(p.fabric.toLowerCase()));
  }
  if (params.occasions?.length) {
    const wanted = new Set(params.occasions.map((o) => o.toLowerCase()));
    items = items.filter((p) => p.occasion.some((o) => wanted.has(o.toLowerCase())));
  }
  const effectivePrice = (p: (typeof items)[number]) => p.salePrice?.amount ?? p.price.amount;
  if (params.priceMin !== undefined) {
    items = items.filter((p) => effectivePrice(p) >= params.priceMin!);
  }
  if (params.priceMax !== undefined) {
    items = items.filter((p) => effectivePrice(p) <= params.priceMax!);
  }

  switch (params.sort) {
    case "price_asc":
      items = [...items].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case "price_desc":
      items = [...items].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case "popularity":
      items = [...items].sort((a, b) => b.rating.count - a.rating.count);
      break;
    case "newest":
    default:
      items = [...items].sort((a, b) => (b.badges.includes("new") ? 1 : 0) - (a.badges.includes("new") ? 1 : 0));
      break;
  }

  const allSizes = ["S", "M", "L", "XL", "XXL"];
  const allColors = Array.from(
    new Map(mockProductListItems.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
  );
  const allFabrics = Array.from(new Set(mockProductListItems.map((p) => p.fabric)));
  const allOccasions = Array.from(new Set(mockProductListItems.flatMap((p) => p.occasion)));
  const prices = mockProductListItems.map((p) => p.salePrice?.amount ?? p.price.amount);

  return {
    items,
    filters: {
      sizes: allSizes,
      colors: allColors,
      fabrics: allFabrics,
      occasions: allOccasions,
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    },
    totalItems: items.length,
  };
}

function buildQueryString(params: ProductQueryParams): string {
  const search = new URLSearchParams();
  if (params.collectionSlug) search.set("collection", params.collectionSlug);
  if (params.sort) search.set("sort", params.sort);
  if (params.sizes?.length) search.set("sizes", params.sizes.join(","));
  if (params.colors?.length) search.set("colors", params.colors.join(","));
  if (params.fabrics?.length) search.set("fabrics", params.fabrics.join(","));
  if (params.occasions?.length) search.set("occasions", params.occasions.join(","));
  if (params.priceMin !== undefined) search.set("priceMin", String(params.priceMin));
  if (params.priceMax !== undefined) search.set("priceMax", String(params.priceMax));
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getProducts(params: ProductQueryParams = {}) {
  if (env.useMockApi) {
    await mockDelay();
    return applyMockFilters(params);
  }
  return apiFetch(`/products${buildQueryString(params)}`, productListResponseSchema, {
    next: { tags: ["products"], revalidate: 300 },
  });
}

export async function getProductBySlug(slug: string) {
  if (env.useMockApi) {
    await mockDelay();
    const product = findMockProductBySlug(slug);
    if (!product) throw new NotFoundApiError("We couldn't find this kurti.");
    return product;
  }
  return apiFetch(`/products/${encodeURIComponent(slug)}`, productDetailSchema, {
    next: { tags: ["products", `product:${slug}`], revalidate: 300 },
  });
}

/** Used for "similar kurtis" — fetches each slug individually and silently drops ones that fail (e.g. discontinued). */
export async function getProductsBySlugs(slugs: string[]) {
  const results = await Promise.allSettled(slugs.map((slug) => getProductBySlug(slug)));
  return results
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getProductBySlug>>> => r.status === "fulfilled")
    .map((r) => productDetailToListItem(r.value));
}
