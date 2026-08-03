import { z } from "zod";

export const newsletterSubscribeRequestSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  source: z.enum(["homepage", "footer"]).default("footer"),
});
export type NewsletterSubscribeRequest = z.infer<typeof newsletterSubscribeRequestSchema>;

export const newsletterSubscribeResponseSchema = z.object({
  subscribed: z.boolean(),
  message: z.string(),
});
export type NewsletterSubscribeResponse = z.infer<typeof newsletterSubscribeResponseSchema>;
