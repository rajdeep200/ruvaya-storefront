import type { StorefrontConfig } from "@/lib/validation/storefrontConfig";

export const mockStorefrontConfig: StorefrontConfig = {
  announcementMessages: [
    "Free shipping on orders above ₹999",
    "COD available across India",
  ],
  whatsappNumber: "+919876543210",
  supportEmail: "hello@ruvaya.com",
  supportPhone: "+91 98765 43210",
  supportHours: "Mon – Sat, 10AM – 7PM",
  addressLine: "Bangalore, India",
  socialLinks: [
    { platform: "instagram", href: "https://instagram.com/ruvaya_ethnicwear" },
    { platform: "facebook", href: "https://facebook.com/ruvaya" },
    { platform: "pinterest", href: "https://pinterest.com/ruvaya" },
    { platform: "whatsapp", href: "https://wa.me/919876543210" },
  ],
  footerColumns: [
    {
      heading: "Shop",
      links: [
        { label: "Shop All", href: "/kurtis" },
        { label: "Everyday Kurtis", href: "/collections/everyday-kurtis" },
        { label: "Office Wear", href: "/collections/office-wear" },
        { label: "Cotton Kurtis", href: "/collections/cotton-kurtis" },
        { label: "Festive", href: "/collections/festive-kurtis" },
        { label: "New Arrivals", href: "/collections/new-arrivals" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "Track Order", href: "/track-order" },
        { label: "Returns & Exchanges", href: "/return-refund-policy" },
        { label: "Shipping Info", href: "/shipping-policy" },
        { label: "Size Guide", href: "/size-guide" },
        { label: "FAQs", href: "/help" },
        { label: "Contact Us", href: "/help" },
      ],
    },
    {
      heading: "About",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Craftsmanship", href: "/about" },
        { label: "Sustainability", href: "/about" },
        { label: "Careers", href: "/help" },
        { label: "Press", href: "/help" },
        { label: "Bulk Orders", href: "/help" },
      ],
    },
  ],
  legalText: `© ${new Date().getUTCFullYear()} Ruvaya Ethnic Wear. All rights reserved.`,
  maintenanceMode: false,
};
