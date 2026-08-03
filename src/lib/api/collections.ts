import { env } from "@/config/env";
import { apiFetch } from "./client";
import { NotFoundApiError } from "./errors";
import { collectionDetailSchema, collectionSummarySchema } from "@/lib/validation/collection";
import { z } from "zod";
import { mockDelay } from "@/lib/mock/delay";
import { findMockCollectionBySlug, mockCollectionSummaries } from "@/lib/mock/collections";

export async function getCollections() {
  if (env.useMockApi) {
    await mockDelay();
    return mockCollectionSummaries;
  }
  return apiFetch("/collections", z.array(collectionSummarySchema), {
    next: { tags: ["collections"], revalidate: 3600 },
  });
}

export async function getCollectionBySlug(slug: string) {
  if (env.useMockApi) {
    await mockDelay();
    const collection = findMockCollectionBySlug(slug);
    if (!collection) throw new NotFoundApiError("We couldn't find this collection.");
    return collection;
  }
  return apiFetch(`/collections/${encodeURIComponent(slug)}`, collectionDetailSchema, {
    next: { tags: ["collections", `collection:${slug}`], revalidate: 300 },
  });
}
