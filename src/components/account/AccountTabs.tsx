"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, MapPin } from "lucide-react";
import { AccountLogoutButton } from "./AccountLogoutButton";

const TABS = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account navigation" className="flex flex-wrap items-center gap-1 border-b border-border pb-3">
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/account" ? pathname === "/account" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium ${
              isActive ? "bg-surface-muted text-primary" : "text-text-secondary hover:text-primary"
            }`}
          >
            <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      <AccountLogoutButton />
    </nav>
  );
}
