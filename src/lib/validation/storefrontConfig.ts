import { z } from "zod";
import { linkSchema } from "./common";

export const footerColumnSchema = z.object({
  heading: z.string(),
  links: z.array(linkSchema),
});
export type FooterColumn = z.infer<typeof footerColumnSchema>;

export const storefrontConfigSchema = z.object({
  announcementMessages: z.array(z.string()).default([]),
  whatsappNumber: z.string(),
  supportEmail: z.string().email(),
  supportPhone: z.string(),
  supportHours: z.string(),
  addressLine: z.string(),
  socialLinks: z.array(z.object({ platform: z.string(), href: z.string() })).default([]),
  footerColumns: z.array(footerColumnSchema).default([]),
  legalText: z.string(),
  maintenanceMode: z.boolean().default(false),
});
export type StorefrontConfig = z.infer<typeof storefrontConfigSchema>;
