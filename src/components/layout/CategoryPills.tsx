"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/types";

export function CategoryPills({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium tracking-wide whitespace-nowrap uppercase ${
              isActive
                ? "border-primary bg-primary text-white"
                : `border-border text-text-primary ${item.isSale ? "text-error" : ""}`
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
