"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { User, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { logout } from "@/lib/api/auth";
import type { Account } from "@/lib/validation/auth";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function AccountMenu({ account }: { account: Account }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`My account, ${account.name}`}
        >
          <User size={20} strokeWidth={1.6} aria-hidden="true" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-40 w-48 rounded-md border border-border bg-background p-1 shadow-lg"
        >
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm text-text-primary hover:bg-surface-muted"
          >
            My Profile
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm text-text-primary hover:bg-surface-muted"
          >
            Orders
          </Link>
          <Link
            href="/account/addresses"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm text-text-primary hover:bg-surface-muted"
          >
            Addresses
          </Link>
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            className="block h-auto w-full justify-start rounded px-3 py-2 text-left text-error hover:bg-surface-muted hover:text-error"
          >
            Logout
          </Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function HeaderActionsRight({
  account,
  variant = "desktop",
}: {
  account: Account | null;
  /** Mobile hides the account icon here — it lives in the hamburger drawer instead. */
  variant?: "desktop" | "mobile";
}) {
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const toggleCartDrawer = useCartStore((s) => s.toggleDrawer);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        href="/wishlist"
        aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
        className="relative flex h-11 w-11 items-center justify-center text-text-primary hover:text-primary"
      >
        <Heart size={20} strokeWidth={1.6} aria-hidden="true" />
        <CountBadge count={wishlistCount} />
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleCartDrawer}
        aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
        className="relative"
      >
        <ShoppingBag size={20} strokeWidth={1.6} aria-hidden="true" />
        <CountBadge count={cartCount} />
      </Button>
      {variant === "desktop" &&
        (account ? (
          <AccountMenu account={account} />
        ) : (
          <Link
            href="/login"
            aria-label="Login"
            className="flex h-11 w-11 items-center justify-center text-text-primary hover:text-primary"
          >
            <User size={20} strokeWidth={1.6} aria-hidden="true" />
          </Link>
        ))}
    </div>
  );
}
