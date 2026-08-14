"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { useProductFilters } from "@/hooks/useProductFilters";
import type { ProductFilterOptions } from "@/types";

const PRICE_BUCKETS = [
  { label: "Under ₹499", min: undefined, max: 498 },
  { label: "₹499 – ₹699", min: 499, max: 699 },
  { label: "Above ₹699", min: 700, max: undefined },
];

type FilterPanelProps = {
  options: ProductFilterOptions;
  isOpen: boolean;
  onClose: () => void;
};

export function FilterPanel({ options, isOpen, onClose }: FilterPanelProps) {
  const { filters, toggleValue, setPriceRange, clearAll } = useProductFilters();

  return (
    <Drawer open={isOpen} onOpenChange={(open) => (open ? undefined : onClose())} direction="right">
      <DrawerContent className="w-[90vw] max-w-sm">
        <VisuallyHidden asChild>
          <DrawerTitle>Filter products</DrawerTitle>
        </VisuallyHidden>
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <span className="text-primary font-serif text-lg">Filters</span>
          <DrawerClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Close filters">
              <X size={20} strokeWidth={1.8} />
            </Button>
          </DrawerClose>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <FilterGroup title="Size">
            <div className="flex flex-wrap gap-2">
              {options.sizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={filters.sizes.includes(size) ? "default" : "secondary"}
                  onClick={() => toggleValue("sizes", size)}
                  aria-pressed={filters.sizes.includes(size)}
                  className="h-auto min-h-11 px-4"
                >
                  {size}
                </Button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Colour">
            <div className="flex flex-wrap gap-2">
              {options.colors.map((color) => (
                <Button
                  key={color.name}
                  type="button"
                  variant={filters.colors.includes(color.name) ? "outline" : "secondary"}
                  onClick={() => toggleValue("colors", color.name)}
                  aria-pressed={filters.colors.includes(color.name)}
                  className="h-auto min-h-11 gap-2 px-3"
                >
                  <span
                    className="border-border h-4 w-4 rounded-full border"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </Button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Fabric">
            <div className="flex flex-wrap gap-2">
              {options.fabrics.map((fabric) => (
                <Button
                  key={fabric}
                  type="button"
                  variant={filters.fabrics.includes(fabric) ? "default" : "secondary"}
                  onClick={() => toggleValue("fabrics", fabric)}
                  aria-pressed={filters.fabrics.includes(fabric)}
                  className="h-auto min-h-11 px-4"
                >
                  {fabric}
                </Button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Price">
            <div className="flex flex-col gap-2">
              {PRICE_BUCKETS.map((bucket) => {
                const isActive = filters.priceMin === bucket.min && filters.priceMax === bucket.max;
                return (
                  <Button
                    key={bucket.label}
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setPriceRange(
                        isActive ? undefined : bucket.min,
                        isActive ? undefined : bucket.max,
                      )
                    }
                    aria-pressed={isActive}
                    className={`h-auto min-h-11 justify-start rounded-md border px-4 text-left ${
                      isActive
                        ? "border-primary bg-surface-muted text-primary"
                        : "border-border text-text-primary"
                    }`}
                  >
                    {bucket.label}
                  </Button>
                );
              })}
            </div>
          </FilterGroup>
        </div>

        <div className="border-border flex gap-3 border-t px-5 py-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              clearAll();
            }}
            className="h-auto min-h-11 flex-1"
          >
            Clear All
          </Button>
          <Button type="button" onClick={onClose} className="h-auto min-h-11 flex-1">
            Show Results
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-border border-b py-4 first:pt-0">
      <h3 className="text-text-primary mb-3 text-xs font-semibold tracking-wide uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
