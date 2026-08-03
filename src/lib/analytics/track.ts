import { env } from "@/config/env";
import { useConsentStore } from "@/store/consent";
import { analyticsEventSchema, type AnalyticsEvent, type AnalyticsEventName } from "@/lib/validation/analytics";
import { buildBaseEventFields } from "./context";
import { enqueueAnalyticsEvent } from "./queue";
import { trackGa4Event } from "./ga4";
import { trackMetaPixelEvent } from "./metaPixel";

type TrackPayload = Omit<Partial<AnalyticsEvent>, "name" | "timestamp" | "sessionId" | "visitorId" | "pagePath" | "deviceCategory">;

const GA4_EVENT_MAP: Partial<Record<AnalyticsEventName, string>> = {
  product_view: "view_item",
  collection_view: "view_item_list",
  add_to_cart: "add_to_cart",
  remove_from_cart: "remove_from_cart",
  cart_view: "view_cart",
  begin_checkout: "begin_checkout",
  purchase: "purchase",
  search: "search",
  newsletter_subscribed: "generate_lead",
};

const META_PIXEL_EVENT_MAP: Partial<Record<AnalyticsEventName, string>> = {
  product_view: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  search: "Search",
  newsletter_subscribed: "Lead",
};

/**
 * The single entry point every component uses to emit analytics. Always
 * enqueues to our first-party pipeline (operational — needed to run the
 * business, not gated on consent). Only mirrors to GA4/Meta when the
 * visitor has granted marketing consent and the feature flag + IDs are
 * configured. Never throws — a tracking bug must never break the page.
 */
export function track(name: AnalyticsEventName, payload: TrackPayload = {}): void {
  try {
    const event: AnalyticsEvent = {
      ...buildBaseEventFields(),
      name,
      ...payload,
    };

    const parsed = analyticsEventSchema.safeParse(event);
    if (!parsed.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[analytics] dropped invalid event", name, parsed.error.flatten());
      }
      return;
    }

    enqueueAnalyticsEvent(parsed.data);

    const marketingConsent = useConsentStore.getState().marketingConsent;
    if (!marketingConsent || !env.enableMarketingAnalytics) return;

    const ga4Name = GA4_EVENT_MAP[name];
    if (ga4Name && env.gaMeasurementId) {
      trackGa4Event(ga4Name, {
        currency: parsed.data.currency,
        value: parsed.data.orderValue ?? parsed.data.cartValue ?? parsed.data.price,
        items: parsed.data.productId ? [{ item_id: parsed.data.productId }] : undefined,
      });
    }

    const metaName = META_PIXEL_EVENT_MAP[name];
    if (metaName && env.metaPixelId) {
      trackMetaPixelEvent(metaName, {
        currency: parsed.data.currency,
        value: parsed.data.orderValue ?? parsed.data.cartValue ?? parsed.data.price,
        content_ids: parsed.data.productId ? [parsed.data.productId] : undefined,
      });
    }
  } catch {
    // Analytics must never break the purchasing flow.
  }
}
