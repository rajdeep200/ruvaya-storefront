"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui";
import { getSearchSuggestions } from "@/lib/api/search";
import { addRecentSearch, getRecentSearches, clearRecentSearches } from "@/lib/storage/recentSearches";
import { formatInr } from "@/lib/formatting";
import { track } from "@/lib/analytics/track";
import type { CollectionSummary, ProductListItem } from "@/types";

const DEBOUNCE_MS = 300;

export function SearchOverlay() {
  const isOpen = useUiStore((s) => s.isSearchOpen);
  const closeSearch = useUiStore((s) => s.closeSearch);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [recentTick, setRecentTick] = useState(0);
  const [popular, setPopular] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);

  // Recomputed on render rather than synced via effect — recentTick just forces
  // a refresh after addRecentSearch()/clearRecentSearches() mutate storage.
  const recent = useMemo(() => {
    void recentTick;
    return isOpen ? getRecentSearches() : [];
  }, [isOpen, recentTick]);

  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();
    if (!trimmed) return;

    const requestId = ++requestIdRef.current;
    const timer = setTimeout(() => {
      setIsLoading(true);
      getSearchSuggestions(trimmed)
        .then((res) => {
          if (requestIdRef.current !== requestId) return;
          setProducts(res.productSuggestions);
          setCollections(res.collectionSuggestions);
          setPopular(res.popularSearches);
          if (res.productSuggestions.length === 0 && res.collectionSuggestions.length === 0) {
            track("zero_search_results", {});
          }
        })
        .catch(() => {
          if (requestIdRef.current === requestId) {
            setProducts([]);
            setCollections([]);
          }
        })
        .finally(() => {
          if (requestIdRef.current === requestId) setIsLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  function goToResults(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setRecentTick((t) => t + 1);
    track("search", { metadata: { query: trimmed } });
    closeSearch();
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => (open ? undefined : closeSearch())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed inset-x-0 top-0 z-50 max-h-[85vh] overflow-y-auto bg-surface shadow-xl focus:outline-none">
          <VisuallyHidden asChild>
            <Dialog.Title>Search Ruvaya</Dialog.Title>
          </VisuallyHidden>
          <div className="mx-auto max-w-2xl px-5 py-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToResults(query);
              }}
              className="flex items-center gap-3 border-b border-border pb-3"
            >
              <Search size={20} strokeWidth={1.6} className="shrink-0 text-text-muted" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search kurtis, colours, fabrics..."
                aria-label="Search"
                className="flex-1 bg-transparent py-2 text-base text-text-primary outline-none placeholder:text-text-muted"
              />
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Close search">
                  <X size={18} strokeWidth={1.8} />
                </Button>
              </Dialog.Close>
            </form>

            {query.trim() === "" ? (
              <div className="py-6">
                {recent.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                        Recent Searches
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          clearRecentSearches();
                          setRecentTick((t) => t + 1);
                        }}
                        className="h-auto p-0 text-xs text-text-muted hover:text-primary"
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <Button
                          key={r}
                          type="button"
                          variant="secondary"
                          onClick={() => goToResults(r)}
                          className="h-auto px-3 py-1.5 text-text-secondary hover:border-primary hover:text-primary"
                        >
                          {r}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="mb-2 text-xs font-semibold tracking-wide text-text-muted uppercase">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(popular.length ? popular : ["Cotton kurtis", "Festive", "Office wear"]).map((p) => (
                      <Button
                        key={p}
                        type="button"
                        variant="secondary"
                        onClick={() => goToResults(p)}
                        className="h-auto px-3 py-1.5 text-text-secondary hover:border-primary hover:text-primary"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4" aria-live="polite">
                {isLoading ? (
                  <p className="py-6 text-center text-sm text-text-muted">Searching...</p>
                ) : products.length === 0 && collections.length === 0 ? (
                  <p className="py-6 text-center text-sm text-text-muted">
                    No results for &ldquo;{query}&rdquo;. Try a different colour, fabric or style.
                  </p>
                ) : (
                  <>
                    {collections.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {collections.map((c) => (
                          <Link
                            key={c.id}
                            href={`/collections/${c.slug}`}
                            onClick={closeSearch}
                            className="rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary hover:border-primary hover:text-primary"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    <ul className="flex flex-col gap-3">
                      {products.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/products/${p.slug}`}
                            onClick={() => {
                              addRecentSearch(query);
                              track("search_result_click", { productId: p.id });
                              closeSearch();
                            }}
                            className="flex items-center gap-3 rounded-md p-2 hover:bg-surface-muted"
                          >
                            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-surface-muted">
                              <Image src={p.primaryImage.url} alt={p.primaryImage.alt} fill sizes="56px" className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">{p.name}</p>
                              <p className="text-sm text-text-secondary">
                                {formatInr(p.salePrice?.amount ?? p.price.amount)}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Button type="button" variant="link" onClick={() => goToResults(query)} className="mt-4">
                      See all results for &ldquo;{query}&rdquo;
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
