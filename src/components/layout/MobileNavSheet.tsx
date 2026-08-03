"use client";

import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, X, ChevronRight, User, Heart, ShoppingBag, Package } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui";
import { useCartStore } from "@/store/cart";
import { getInitials } from "@/lib/formatting";
import type { NavigationItem } from "@/types";
import type { Account } from "@/lib/validation/auth";

type MobileNavSheetProps = {
  items: NavigationItem[];
  account: Account | null;
};

const SECONDARY_LINKS = [
  { label: "Track Order", href: "/track-order" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Help & Support", href: "/help" },
];

export function MobileMenuButton() {
  const openMobileNav = useUiStore((s) => s.openMobileNav);
  return (
    <Button type="button" variant="ghost" size="icon" onClick={openMobileNav} aria-label="Open menu">
      <Menu size={22} strokeWidth={1.8} aria-hidden="true" />
    </Button>
  );
}

export function MobileNavSheet({ items, account }: MobileNavSheetProps) {
  const isOpen = useUiStore((s) => s.isMobileNavOpen);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);
  const toggleCartDrawer = useCartStore((s) => s.toggleDrawer);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => (open ? undefined : closeMobileNav())}
      direction="left"
    >
      <DrawerContent className="w-[85vw] max-w-sm overflow-y-auto px-5 py-6 shadow-xl focus:outline-none">
        <VisuallyHidden asChild>
          <DrawerTitle>Ruvaya menu</DrawerTitle>
        </VisuallyHidden>

        <div className="bg-surface-muted mb-6 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <Link
            href={account ? "/account" : "/login"}
            onClick={closeMobileNav}
            className="text-text-primary flex items-center gap-3 text-sm font-medium"
          >
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarFallback>
                {account ? (
                  getInitials(account.name)
                ) : (
                  <User size={20} strokeWidth={1.6} aria-hidden="true" />
                )}
              </AvatarFallback>
            </Avatar>
            {account ? `Hi, ${account.name.split(" ")[0]}` : "Login"}
          </Link>
          <DrawerClose asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Close menu" className="shrink-0">
              <X size={24} strokeWidth={2} />
            </Button>
          </DrawerClose>
        </div>

        <nav aria-label="Mobile navigation" className="flex flex-col">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={closeMobileNav}
              className={`border-border flex min-h-11 items-center justify-between border-b py-4 text-sm font-bold tracking-[0.12em] uppercase ${
                item.isSale ? "text-error" : "text-text-primary"
              }`}
            >
              {item.label}
              <ChevronRight
                size={18}
                strokeWidth={2}
                className="text-text-muted"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        <div className="border-border mt-2 flex flex-col border-b pb-2">
          {account && (
            <Link
              href="/account/orders"
              onClick={closeMobileNav}
              className="text-text-primary flex min-h-11 items-center justify-between gap-2.5 text-sm font-medium"
            >
              <span className="flex items-center gap-2.5">
                <Package size={20} strokeWidth={1.6} aria-hidden="true" /> My Orders
              </span>
              <ChevronRight size={18} strokeWidth={2} className="text-text-muted" aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/wishlist"
            onClick={closeMobileNav}
            className="text-text-primary flex min-h-11 items-center justify-between gap-2.5 text-sm font-medium"
          >
            <span className="flex items-center gap-2.5">
              <Heart size={20} strokeWidth={1.6} aria-hidden="true" /> Wishlist
            </span>
            <ChevronRight
              size={18}
              strokeWidth={2}
              className="text-text-muted"
              aria-hidden="true"
            />
          </Link>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              closeMobileNav();
              toggleCartDrawer();
            }}
            className="h-auto min-h-11 w-full justify-between gap-2.5 rounded-none px-0 py-0 text-left font-medium"
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag size={20} strokeWidth={1.6} aria-hidden="true" /> My Bag
            </span>
            <ChevronRight
              size={18}
              strokeWidth={2}
              className="text-text-muted"
              aria-hidden="true"
            />
          </Button>
        </div>

        <div className="mt-2 flex flex-col">
          {SECONDARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileNav}
              className="border-border text-text-secondary hover:text-primary flex min-h-11 items-center justify-between border-b py-3 text-sm last:border-0"
            >
              {link.label}
              <ChevronRight
                size={16}
                strokeWidth={1.8}
                className="text-text-muted"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
