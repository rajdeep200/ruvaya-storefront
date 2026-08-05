import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsBySlugs } from "@/lib/api/products";
import { getReviews } from "@/lib/api/reviews";
import { getStorefrontConfig } from "@/lib/api/storefront";
import { NotFoundApiError } from "@/lib/api/errors";
import { productDetailToListItem } from "@/lib/validation/product";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductInfoAccordion } from "@/components/product/ProductInfoAccordion";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { RecentlyViewedList, TrackRecentlyViewed } from "@/components/product/RecentlyViewed";
import { TrackViewEvent } from "@/components/common/TrackViewEvent";
import { JsonLd } from "@/components/common/JsonLd";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/seo/structuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return {
      title: product.name,
      description: product.description,
      alternates: { canonical: `/products/${slug}` },
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.images[0].url }],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundApiError) notFound();
    throw error;
  }

  const [reviews, similarProducts, storefrontConfig] = await Promise.all([
    getReviews({ productId: product.id, sort: "recent" }),
    getProductsBySlugs(product.similarProductSlugs),
    getStorefrontConfig(),
  ]);

  const listItem = productDetailToListItem(product);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <JsonLd data={buildProductJsonLd(product, reviews)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop All", path: "/kurtis" },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
      <TrackViewEvent name="product_view" productId={product.id} price={product.salePrice?.amount ?? product.price.amount} />
      <TrackRecentlyViewed product={listItem} />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/kurtis" className="hover:text-primary">
              Shop All
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery productId={product.id} images={product.images} video={product.video} productName={product.name} />
        <div>
          <ProductPurchasePanel product={product} whatsappNumber={storefrontConfig.whatsappNumber} />
        </div>
      </div>

      <ProductInfoAccordion product={product} />
      <ProductReviewsSection reviews={reviews} productSlug={product.slug} />
      <SimilarProducts products={similarProducts} />
      <RecentlyViewedList excludeProductId={product.id} />
    </div>
  );
}
