import { z } from "zod";

export const navigationItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  isSale: z.boolean().default(false),
});
export type NavigationItem = z.infer<typeof navigationItemSchema>;

export const navigationResponseSchema = z.object({
  primary: z.array(navigationItemSchema),
});
export type NavigationResponse = z.infer<typeof navigationResponseSchema>;
