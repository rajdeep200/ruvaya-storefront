import type { NavigationResponse } from "@/lib/validation/navigation";

/**
 * Mirrors the approved homepage's nav bar exactly (Home / Shop All / Everyday
 * Kurtis / Office Wear / Cotton Kurtis / Festive / New Arrivals / Contact).
 * Kurti Sets, Best Sellers and Sale are fully-built collection pages that
 * simply aren't in the current live nav — the admin can add them here later
 * since this whole list is backend-driven, not hardcoded in the header.
 */
export const mockNavigation: NavigationResponse = {
  primary: [
    { id: "home", label: "Home", href: "/", isSale: false },
    { id: "shop-all", label: "Shop All", href: "/kurtis", isSale: false },
    { id: "everyday-kurtis", label: "Everyday Kurtis", href: "/collections/everyday-kurtis", isSale: false },
    { id: "office-wear", label: "Office Wear", href: "/collections/office-wear", isSale: false },
    { id: "cotton-kurtis", label: "Cotton Kurtis", href: "/collections/cotton-kurtis", isSale: false },
    { id: "festive", label: "Festive", href: "/collections/festive-kurtis", isSale: false },
    { id: "new-arrivals", label: "New Arrivals", href: "/collections/new-arrivals", isSale: false },
    { id: "contact", label: "Contact", href: "/help", isSale: false },
  ],
};
