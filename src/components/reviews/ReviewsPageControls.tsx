"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ImageIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ReviewSort } from "@/types";

const SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "helpful", label: "Most Helpful" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
];

export function ReviewsPageControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = (searchParams.get("sort") as ReviewSort | null) ?? "recent";
  const withPhotos = searchParams.get("withPhotos") === "true";
  const verifiedOnly = searchParams.get("verifiedOnly") === "true";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-1.5 text-sm text-text-secondary">Sort by</p>
        <Select value={sort} onValueChange={(value) => updateParam("sort", value)}>
          <SelectTrigger aria-label="Sort by" className="w-full sm:w-56">
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

      <div className="flex flex-col gap-2 sm:items-end">
        <Button
          type="button"
          variant={withPhotos ? "default" : "secondary"}
          onClick={() => updateParam("withPhotos", withPhotos ? null : "true")}
          aria-pressed={withPhotos}
          className="h-auto min-h-11 justify-start gap-2 px-4"
        >
          <ImageIcon size={16} strokeWidth={1.8} aria-hidden="true" />
          With Photos
        </Button>
        <Button
          type="button"
          variant={verifiedOnly ? "default" : "secondary"}
          onClick={() => updateParam("verifiedOnly", verifiedOnly ? null : "true")}
          aria-pressed={verifiedOnly}
          className="h-auto min-h-11 justify-start gap-2 px-4"
        >
          <ShieldCheck size={16} strokeWidth={1.8} aria-hidden="true" />
          Verified Purchases Only
        </Button>
      </div>
    </div>
  );
}
