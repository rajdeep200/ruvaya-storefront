"use client";

import Script from "next/script";
import { env } from "@/config/env";
import { useConsentStore } from "@/store/consent";

/**
 * GA4 + Meta Pixel load only after the visitor grants marketing consent (and
 * only if the operator has configured IDs and flipped the feature flag).
 * Our own /analytics/events pipeline is unaffected by this — it's the
 * always-on operational stream; this component is purely the optional,
 * consent-gated third-party mirror.
 */
export function MarketingScripts() {
  const marketingConsent = useConsentStore((s) => s.marketingConsent);
  const hasResponded = useConsentStore((s) => s.hasResponded);

  if (!hasResponded || !marketingConsent || !env.enableMarketingAnalytics) return null;

  return (
    <>
      {env.gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${env.gaMeasurementId}');
            `}
          </Script>
        </>
      )}
      {env.metaPixelId && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${env.metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
