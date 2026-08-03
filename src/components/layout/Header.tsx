import Link from "next/link";
import { RuvayaLogo } from "@/components/common/RuvayaLogo";
import { DesktopNav } from "./DesktopNav";
import { HeaderActionsRight } from "./HeaderActions";
import { MobileMenuButton, MobileNavSheet } from "./MobileNavSheet";
import { CategoryPills } from "./CategoryPills";
import { getCurrentAccount } from "@/lib/auth/session";
import type { NavigationItem } from "@/types";

type HeaderProps = {
  navigation: NavigationItem[];
};

// The backend's nav config sends hrefs that don't match this storefront's
// actual routes (e.g. collection pages live at /collections/[slug], not at
// the bare slug). Remap the known cases here until the backend is corrected.
const HREF_REWRITES: Record<string, string> = {
  "/new-arrivals": "/collections/new-arrivals",
};

export async function Header({ navigation }: HeaderProps) {
  const account = await getCurrentAccount();
  const items = navigation
    // "Collections" points at bare /collections, which has no index page —
    // this storefront only has /collections/[slug]. Drop it until either
    // that page exists or the backend stops sending it.
    .filter((item) => item.href !== "/collections")
    .map((item) => (HREF_REWRITES[item.href] ? { ...item, href: HREF_REWRITES[item.href] } : item));

  return (
    <header className="sticky top-0 z-30 bg-background">
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="relative flex items-center justify-between px-4 py-3">
          <MobileMenuButton />
          <Link
            href="/"
            aria-label="Ruvaya home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <RuvayaLogo size={56} />
          </Link>
          <HeaderActionsRight account={account} variant="mobile" />
        </div>
        <CategoryPills items={items} />
      </div>

      {/* Desktop — single row: logo left, nav truly centered on the row
          (independent of the logo/icon cluster widths), icons right. */}
      <div className="relative mx-auto hidden max-w-6xl items-center px-6 py-8 lg:flex">
        <Link href="/" aria-label="Ruvaya home" className="shrink-0">
          <RuvayaLogo size={112} />
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
          <DesktopNav items={items} />
        </div>
        <div className="ml-auto">
          <HeaderActionsRight account={account} variant="desktop" />
        </div>
      </div>

      <MobileNavSheet items={items} account={account} />
    </header>
  );
}
