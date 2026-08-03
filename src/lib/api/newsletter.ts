import { env } from "@/config/env";
import { apiFetch } from "./client";
import {
  newsletterSubscribeResponseSchema,
  type NewsletterSubscribeRequest,
} from "@/lib/validation/newsletter";
import { mockDelay } from "@/lib/mock/delay";

export async function subscribeNewsletter(request: NewsletterSubscribeRequest) {
  if (env.useMockApi) {
    await mockDelay(500);
    return { subscribed: true, message: "You're on the list — welcome to the Ruvaya family!" };
  }
  return apiFetch("/newsletter", newsletterSubscribeResponseSchema, {
    method: "POST",
    body: request,
  });
}
