"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductFilters } from "@/hooks/useProductFilters";
import { FilterPanel } from "./FilterPanel";
import type { ProductFilterOptions, ProductSort } from "@/types";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

type ProductListingControlsProps = {
  totalItems: number;
  filterOptions: ProductFilterOptions;
};

export function ProductListingControls({ totalItems, filterOptions }: ProductListingControlsProps) {
  const { filters, activeFilterCount, setSort, removeFilter, clearAll } = useProductFilters();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          {totalItems} {totalItems === 1 ? "kurti" : "kurtis"}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm whitespace-nowrap text-text-secondary">
            Sort by
            <Select value={filters.sort} onValueChange={(value) => setSort(value as ProductSort)}>
              <SelectTrigger aria-label="Sort by" className="whitespace-nowrap">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsFilterOpen(true)}
            className="h-auto min-h-11 gap-2 rounded-md px-4 hover:border-primary"
          >
            <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filters.sizes.map((v) => (
            <FilterChip key={`size-${v}`} label={`Size: ${v}`} onRemove={() => removeFilter("sizes", v)} />
          ))}
          {filters.colors.map((v) => (
            <FilterChip key={`color-${v}`} label={v} onRemove={() => removeFilter("colors", v)} />
          ))}
          {filters.fabrics.map((v) => (
            <FilterChip key={`fabric-${v}`} label={v} onRemove={() => removeFilter("fabrics", v)} />
          ))}
          {filters.occasions.map((v) => (
            <FilterChip key={`occasion-${v}`} label={v} onRemove={() => removeFilter("occasions", v)} />
          ))}
          {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
            <FilterChip label="Price" onRemove={() => removeFilter("price")} />
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={clearAll}
            className="h-auto p-0 text-xs text-text-muted hover:text-primary"
          >
            Clear All
          </Button>
        </div>
      )}

      <FilterPanel options={filterOptions} isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-3 pr-1.5 text-xs text-text-primary">
      {label}
      <Button
        type="button"
        variant="ghost"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="h-5 w-5 p-0 text-text-muted hover:text-error"
      >
        ×
      </Button>
    </span>
  );
}
