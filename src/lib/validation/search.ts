import { z } from "zod";
import { productListItemSchema } from "./product";
import { collectionSummarySchema } from "./collection";

export const searchSuggestionsResponseSchema = z.object({
  popularSearches: z.array(z.string()),
  productSuggestions: z.array(productListItemSchema),
  collectionSuggestions: z.array(collectionSummarySchema),
});
export type SearchSuggestionsResponse = z.infer<typeof searchSuggestionsResponseSchema>;

export const searchResultsResponseSchema = z.object({
  query: z.string(),
  products: z.array(productListItemSchema),
  collections: z.array(collectionSummarySchema),
  totalItems: z.number().int().nonnegative(),
});
export type SearchResultsResponse = z.infer<typeof searchResultsResponseSchema>;
