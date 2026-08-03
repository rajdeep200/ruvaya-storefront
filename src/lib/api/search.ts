import { env } from "@/config/env";
import { apiFetch } from "./client";
import { searchResultsResponseSchema, searchSuggestionsResponseSchema } from "@/lib/validation/search";
import { mockDelay } from "@/lib/mock/delay";
import { mockProductListItems } from "@/lib/mock/products";
import { mockCollectionSummaries } from "@/lib/mock/collections";

const POPULAR_SEARCHES = ["Cotton kurtis", "Festive", "Office wear", "Kurti sets", "Under ₹1,500"];

function matches(query: string, ...fields: (string | string[])[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return fields.some((field) => {
    const values = Array.isArray(field) ? field : [field];
    return values.some((v) => v.toLowerCase().includes(q));
  });
}

export async function getSearchSuggestions(query: string) {
  if (env.useMockApi) {
    await mockDelay(150);
    const productSuggestions = mockProductListItems
      .filter((p) => matches(query, p.name, p.fabric, p.occasion, p.colors.map((c) => c.name)))
      .slice(0, 5);
    const collectionSuggestions = mockCollectionSummaries
      .filter((c) => matches(query, c.name))
      .slice(0, 3);
    return { popularSearches: POPULAR_SEARCHES, productSuggestions, collectionSuggestions };
  }
  return apiFetch(
    `/search?mode=suggest&q=${encodeURIComponent(query)}`,
    searchSuggestionsResponseSchema,
  );
}

export async function getSearchResults(query: string, page = 1) {
  if (env.useMockApi) {
    await mockDelay();
    const products = mockProductListItems.filter((p) =>
      matches(query, p.name, p.fabric, p.occasion, p.category, p.colors.map((c) => c.name)),
    );
    const collections = mockCollectionSummaries.filter((c) => matches(query, c.name));
    return { query, products, collections, totalItems: products.length };
  }
  return apiFetch(
    `/search?mode=results&q=${encodeURIComponent(query)}&page=${page}`,
    searchResultsResponseSchema,
  );
}
