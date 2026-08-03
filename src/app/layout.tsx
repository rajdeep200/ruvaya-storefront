import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { env } from "@/config/env";
import { getStorefrontConfig } from "@/lib/api/storefront";
import { getNavigation } from "@/lib/api/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/common/SearchOverlay";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CookieConsentBanner } from "@/components/common/CookieConsentBanner";
import { Toaster } from "@/components/common/Toaster";
import { AnalyticsRouteListener } from "@/components/common/AnalyticsRouteListener";
import { MarketingScripts } from "@/components/common/MarketingScripts";
import { MaintenancePage } from "@/components/common/MaintenancePage";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Ruvaya — Timeless Kurtis for the Modern Indian Woman",
    template: "%s | Ruvaya",
  },
  description:
    "Carefully curated everyday, office-wear, cotton and festive kurtis — thoughtfully styled, honestly fitted, made for Indian women.",
  openGraph: {
    type: "website",
    siteName: "Ruvaya",
    title: "Ruvaya — Timeless Kurtis for the Modern Indian Woman",
    description:
      "Carefully curated everyday, office-wear, cotton and festive kurtis — thoughtfully styled, honestly fitted.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruvaya — Timeless Kurtis for the Modern Indian Woman",
  },
};

export const viewport = {
  themeColor: "#6b4530",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [storefrontConfig, navigation] = await Promise.all([getStorefrontConfig(), getNavigation()]);

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-text-primary">
        {storefrontConfig.maintenanceMode ? (
          <MaintenancePage whatsappNumber={storefrontConfig.whatsappNumber} />
        ) : (
          <>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>

            <AnnouncementBar messages={storefrontConfig.announcementMessages} />
            <Header navigation={navigation.primary} />

            <main id="main-content" className="flex-1">
              {children}
            </main>

            <Footer config={storefrontConfig} />

            <CartDrawer />
            <SearchOverlay />
            <WhatsAppButton whatsappNumber={storefrontConfig.whatsappNumber} />
            <CookieConsentBanner />
            <Toaster />
            <AnalyticsRouteListener />
            <MarketingScripts />
          </>
        )}
      </body>
    </html>
  );
}
