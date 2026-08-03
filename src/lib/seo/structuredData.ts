import { env } from "@/config/env";
import type { CollectionDetail, ProductDetail, ReviewListResponse } from "@/types";

/** Escapes `</script` so structured-data JSON can never prematurely close its own <script> tag. */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ruvaya",
    url: env.siteUrl,
    sameAs: [] as string[],
  };
}

export function buildProductJsonLd(product: ProductDetail, reviews?: ReviewListResponse) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: product.id,
    brand: { "@type": "Brand", name: "Ruvaya" },
    offers: {
      "@type": "Offer",
      url: `${env.siteUrl}/products/${product.slug}`,
      priceCurrency: "INR",
      price: (product.salePrice?.amount ?? product.price.amount).toFixed(2),
      availability: product.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(reviews && reviews.summary.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviews.summary.average,
            reviewCount: reviews.summary.count,
          },
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${env.siteUrl}${item.path}`,
    })),
  };
}

export function buildCollectionJsonLd(collection: CollectionDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: `${env.siteUrl}/collections/${collection.slug}`,
  };
}
