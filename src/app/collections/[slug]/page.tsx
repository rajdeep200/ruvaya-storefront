import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCollections, getCollectionBySlug } from "@/lib/api/collections";
import { getProducts, parseProductSearchParams, type RawSearchParams } from "@/lib/api/products";
import { NotFoundApiError } from "@/lib/api/errors";
import { ProductListingControls } from "@/components/collection/ProductListingControls";
import { ProductGrid } from "@/components/collection/ProductGrid";
import { TrackViewEvent } from "@/components/common/TrackViewEvent";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const collection = await getCollectionBySlug(slug);
    return {
      title: collection.seo?.title ?? collection.name,
      description: collection.seo?.description ?? collection.description,
      alternates: { canonical: collection.seo?.canonicalPath ?? `/collections/${slug}` },
    };
  } catch {
    return { title: "Collection" };
  }
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  let collection;
  try {
    collection = await getCollectionBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundApiError) notFound();
    throw error;
  }

  const query = parseProductSearchParams(resolvedSearchParams);
  const { items, filters, totalItems } = await getProducts({ ...query, collectionSlug: slug });

  return (
    <div>
      <TrackViewEvent name="collection_view" collectionId={collection.id} />

      {collection.heroImage && (
        <div className="relative h-48 w-full overflow-hidden sm:h-64">
          <Image src={collection.heroImage.url} alt={collection.heroImage.alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-3xl text-text-primary uppercase">{collection.name}</h1>
        {collection.description && (
          <p className="mt-2 max-w-xl text-sm text-text-secondary">{collection.description}</p>
        )}

        <div className="mt-8">
          <ProductListingControls totalItems={totalItems} filterOptions={filters} />
          <ProductGrid products={items} />
        </div>
      </div>
    </div>
  );
}
