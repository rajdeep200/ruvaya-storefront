import { z } from "zod";
import { env } from "@/config/env";
import { apiFetch } from "./client";
import { apiErrorEnvelopeSchema } from "@/lib/validation/common";
import { AuthExpiredError, ServerApiError, ValidationApiError, mapBackendErrorCode } from "./errors";
import {
  reviewListResponseSchema,
  reviewSubmissionAckSchema,
  reviewTokenContextSchema,
  type ReviewSort,
  type ReviewSubmissionValues,
} from "@/lib/validation/review";
import { mockDelay } from "@/lib/mock/delay";
import { mockReviews, mockReviewTokens } from "@/lib/mock/reviews";

export type ReviewListParams = {
  productId?: string;
  sort?: ReviewSort;
  withPhotosOnly?: boolean;
  verifiedOnly?: boolean;
  page?: number;
};

export async function getReviews(params: ReviewListParams = {}) {
  if (env.useMockApi) {
    await mockDelay();
    let reviews = params.productId
      ? mockReviews.filter((r) => r.productId === params.productId)
      : [...mockReviews];

    if (params.withPhotosOnly) reviews = reviews.filter((r) => r.images.length > 0);
    if (params.verifiedOnly) reviews = reviews.filter((r) => r.isVerifiedPurchase);

    switch (params.sort) {
      case "highest":
        reviews = [...reviews].sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        reviews = [...reviews].sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        reviews = [...reviews].sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case "recent":
      default:
        reviews = [...reviews].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    const count = reviews.length;
    const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
    reviews.forEach((r) => {
      const bucket = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      distribution[bucket] = (distribution[bucket] ?? 0) + 1;
    });

    return {
      summary: { average: Math.round(average * 10) / 10, count, distribution },
      reviews,
      totalItems: count,
    };
  }

  const search = new URLSearchParams();
  if (params.productId) search.set("productId", params.productId);
  if (params.sort) search.set("sort", params.sort);
  if (params.withPhotosOnly) search.set("withPhotos", "true");
  if (params.verifiedOnly) search.set("verifiedOnly", "true");
  if (params.page) search.set("page", String(params.page));
  return apiFetch(`/reviews?${search.toString()}`, reviewListResponseSchema, {
    next: { tags: params.productId ? [`reviews:${params.productId}`] : ["reviews"], revalidate: 120 },
  });
}

export async function getReviewTokenContext(secureToken: string) {
  if (env.useMockApi) {
    await mockDelay(300);
    const context = mockReviewTokens[secureToken];
    if (!context) throw new AuthExpiredError();
    return context;
  }
  return apiFetch(`/reviews/${encodeURIComponent(secureToken)}`, reviewTokenContextSchema);
}

/**
 * `images` are raw Files from the upload widget — never JSON. The backend
 * (not this client) determines `isVerifiedPurchase`; it is not, and must
 * never be, a field this function can set.
 *
 * Uses XMLHttpRequest instead of `apiFetch` specifically so real upload
 * progress (`onProgress`) is available — `fetch` has no upload-progress
 * event. This is the one deliberate exception to routing everything through
 * the shared client; the response is still Zod-validated before returning.
 */
export async function submitReview(
  secureToken: string,
  values: ReviewSubmissionValues,
  images: File[],
  onProgress?: (percent: number) => void,
) {
  if (env.useMockApi) {
    const steps = [20, 45, 70, 100];
    for (const step of steps) {
      await mockDelay(220);
      onProgress?.(step);
    }
    return { submitted: true, message: "Thank you — your review has been submitted for publishing." };
  }

  if (!env.apiBaseUrl) {
    throw new ServerApiError("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, String(value));
  });
  images.forEach((file) => formData.append("images", file));

  const { json, status } = await new Promise<{ json: unknown; status: number }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${env.apiBaseUrl}/reviews/${encodeURIComponent(secureToken)}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        resolve({ json: JSON.parse(xhr.responseText), status: xhr.status });
      } catch {
        reject(new ServerApiError("Received an unexpected response from the server.", xhr.status));
      }
    };
    xhr.onerror = () => reject(new ServerApiError("Something went wrong uploading your review."));
    xhr.send(formData);
  });

  const looksLikeFailure =
    status < 200 ||
    status >= 300 ||
    (typeof json === "object" && json !== null && (json as { success?: boolean }).success === false);

  if (looksLikeFailure) {
    const errorEnvelope = apiErrorEnvelopeSchema.safeParse(json);
    if (errorEnvelope.success) {
      const { code, message, details } = errorEnvelope.data.error;
      throw mapBackendErrorCode(code, message, details);
    }
    throw new ServerApiError("Something went wrong on our end. Please try again shortly.", status);
  }

  const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(json);
  if (!envelope.success) {
    throw new ValidationApiError("The server returned data we couldn't understand.", envelope.error.flatten());
  }

  const parsed = reviewSubmissionAckSchema.safeParse(envelope.data.data);
  if (!parsed.success) {
    throw new ValidationApiError("The server returned data we couldn't understand.", parsed.error.flatten());
  }
  return parsed.data;
}
