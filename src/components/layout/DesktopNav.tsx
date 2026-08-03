"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/types";

type DesktopNavProps = {
  items: NavigationItem[];
};

export function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-5 whitespace-nowrap">
        {items.map((item, index) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.id} className="flex items-center gap-5">
              {index > 0 && (
                <span aria-hidden="true" className="text-border">
                  |
                </span>
              )}
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`font-serif text-lg transition-colors ${
                  isActive ? "text-primary" : "text-text-primary hover:text-primary"
                } ${item.isSale ? "text-error" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
