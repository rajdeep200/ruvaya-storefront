"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { track } from "@/lib/analytics/track";
import type { ProductSort } from "@/types";

export type ProductFilterKey = "sizes" | "colors" | "fabrics" | "occasions";

const ARRAY_KEYS: ProductFilterKey[] = ["sizes", "colors", "fabrics", "occasions"];

function parseArrayParam(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

/** Reads/writes shareable, query-string-based filter + sort state for /kurtis and /collections/[slug]. */
export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      sort: (searchParams.get("sort") as ProductSort | null) ?? "newest",
      sizes: parseArrayParam(searchParams.get("sizes")),
      colors: parseArrayParam(searchParams.get("colors")),
      fabrics: parseArrayParam(searchParams.get("fabrics")),
      occasions: parseArrayParam(searchParams.get("occasions")),
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    }),
    [searchParams],
  );

  const activeFilterCount =
    filters.sizes.length +
    filters.colors.length +
    filters.fabrics.length +
    filters.occasions.length +
    (filters.priceMin !== undefined || filters.priceMax !== undefined ? 1 : 0);

  const navigate = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setSort = useCallback(
    (sort: ProductSort) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sort);
      navigate(params);
      track("sort_changed", { metadata: { sort } });
    },
    [searchParams, navigate],
  );

  const toggleValue = useCallback(
    (key: ProductFilterKey, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = parseArrayParam(params.get(key));
      const exists = current.includes(value);
      const next = exists ? current.filter((v) => v !== value) : [...current, value];
      if (next.length > 0) {
        params.set(key, next.join(","));
      } else {
        params.delete(key);
      }
      navigate(params);
      track(exists ? "filter_removed" : "filter_applied", { metadata: { key, value } });
    },
    [searchParams, navigate],
  );

  const setPriceRange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min !== undefined) params.set("priceMin", String(min));
      else params.delete("priceMin");
      if (max !== undefined) params.set("priceMax", String(max));
      else params.delete("priceMax");
      navigate(params);
      track("filter_applied", { metadata: { key: "price", min: min ?? 0, max: max ?? 0 } });
    },
    [searchParams, navigate],
  );

  const removeFilter = useCallback(
    (key: ProductFilterKey | "price", value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "price") {
        params.delete("priceMin");
        params.delete("priceMax");
      } else if (value) {
        const next = parseArrayParam(params.get(key)).filter((v) => v !== value);
        if (next.length > 0) params.set(key, next.join(","));
        else params.delete(key);
      } else {
        params.delete(key);
      }
      navigate(params);
      track("filter_removed", { metadata: { key, value: value ?? "" } });
    },
    [searchParams, navigate],
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    [...ARRAY_KEYS, "priceMin", "priceMax"].forEach((key) => params.delete(key));
    navigate(params);
  }, [searchParams, navigate]);

  return { filters, activeFilterCount, setSort, toggleValue, setPriceRange, removeFilter, clearAll };
}
