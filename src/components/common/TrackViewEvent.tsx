"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";
import type { AnalyticsEventName } from "@/lib/validation/analytics";

type TrackViewEventProps = {
  name: AnalyticsEventName;
  productId?: string;
  collectionId?: string;
  price?: number;
  cartValue?: number;
  metadata?: Record<string, string | number | boolean>;
};

/** Fires one view event when a page mounts (or its identifying prop changes) — e.g. product_view, collection_view, cart_view, policy_viewed. */
export function TrackViewEvent({ name, productId, collectionId, price, cartValue, metadata }: TrackViewEventProps) {
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    const key = `${name}:${productId ?? ""}:${collectionId ?? ""}:${cartValue ?? ""}:${JSON.stringify(metadata ?? {})}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    track(name, { productId, collectionId, price, cartValue, metadata });
  }, [name, productId, collectionId, price, cartValue, metadata]);

  return null;
}
