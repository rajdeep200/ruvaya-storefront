import { z } from "zod";
import { env } from "@/config/env";
import { apiErrorEnvelopeSchema } from "@/lib/validation/common";
import { NetworkError, ServerApiError, ValidationApiError, mapBackendErrorCode } from "./errors";

export type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Next.js fetch cache directives — only meaningful for server-side calls. */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /** Overrides env.apiBaseUrl — used for calls to the storefront's own same-origin proxy routes (e.g. /api/checkout) instead of the external API. */
  baseUrl?: string;
};

/**
 * The one place that talks to `NEXT_PUBLIC_API_BASE_URL`. Every `lib/api/*`
 * module goes through this — components never see fetch, envelopes, or raw
 * backend error shapes. Response bodies are Zod-validated before returning,
 * so a malformed backend response surfaces as a typed `ValidationApiError`
 * instead of corrupting UI state silently.
 */
export async function apiFetch<Schema extends z.ZodTypeAny>(
  path: string,
  schema: Schema,
  options: ApiFetchOptions = {},
): Promise<z.infer<Schema>> {
  if (options.baseUrl === undefined && !env.apiBaseUrl) {
    throw new ServerApiError(
      "NEXT_PUBLIC_API_BASE_URL is not configured. Set it in .env.local or enable mock mode.",
    );
  }

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const url = `${options.baseUrl ?? env.apiBaseUrl}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: isFormData
        ? options.headers
        : { "Content-Type": "application/json", ...options.headers },
      body: isFormData
        ? (options.body as FormData)
        : options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
      cache: options.cache,
      next: options.next,
      signal: options.signal,
    });
  } catch {
    throw new NetworkError();
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ServerApiError("Received an unexpected response from the server.", response.status);
  }

  const looksLikeFailure =
    !response.ok ||
    (typeof json === "object" && json !== null && (json as { success?: boolean }).success === false);

  if (looksLikeFailure) {
    const errorEnvelope = apiErrorEnvelopeSchema.safeParse(json);
    if (errorEnvelope.success) {
      const { code, message, details } = errorEnvelope.data.error;
      throw mapBackendErrorCode(code, message, details);
    }
    throw new ServerApiError(
      "Something went wrong on our end. Please try again shortly.",
      response.status,
    );
  }

  const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(json);
  if (!envelope.success) {
    throw new ValidationApiError(
      "The server returned data we couldn't understand.",
      envelope.error.flatten(),
    );
  }

  const parsedData = schema.safeParse(envelope.data.data);
  if (!parsedData.success) {
    throw new ValidationApiError(
      "The server returned data we couldn't understand.",
      parsedData.error.flatten(),
    );
  }

  return parsedData.data;
}
