import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/payment/status",
        "/order-confirmation/",
        "/orders/",
        "/review/",
        "/wishlist",
        "/search",
        "/api/",
      ],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
