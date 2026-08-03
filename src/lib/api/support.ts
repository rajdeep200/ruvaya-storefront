import { env } from "@/config/env";
import { apiFetch } from "./client";
import {
  supportContactResponseSchema,
  type SupportContactRequest,
} from "@/lib/validation/support";
import { mockDelay } from "@/lib/mock/delay";

export async function submitSupportContact(request: SupportContactRequest) {
  if (env.useMockApi) {
    await mockDelay(500);
    return { received: true, message: "Thanks for reaching out — our team will get back to you within a day." };
  }
  return apiFetch("/support", supportContactResponseSchema, {
    method: "POST",
    body: request,
  });
}
