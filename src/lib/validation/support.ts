import { z } from "zod";

export const supportContactRequestSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  orderNumber: z.string().optional(),
  message: z.string().min(10, "Tell us a little more"),
});
export type SupportContactRequest = z.infer<typeof supportContactRequestSchema>;

export const supportContactResponseSchema = z.object({
  received: z.boolean(),
  message: z.string(),
});
export type SupportContactResponse = z.infer<typeof supportContactResponseSchema>;

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export type FaqItem = z.infer<typeof faqItemSchema>;
