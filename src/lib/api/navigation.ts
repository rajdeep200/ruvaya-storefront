import { env } from "@/config/env";
import { apiFetch } from "./client";
import { navigationResponseSchema } from "@/lib/validation/navigation";
import { mockDelay } from "@/lib/mock/delay";
import { mockNavigation } from "@/lib/mock/navigation";

export async function getNavigation() {
  if (env.useMockApi) {
    await mockDelay();
    return mockNavigation;
  }
  return apiFetch("/navigation", navigationResponseSchema, {
    next: { tags: ["navigation"], revalidate: 3600 },
  });
}
