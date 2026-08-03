import { env } from "@/config/env";
import { apiFetch } from "./client";
import { NotFoundApiError } from "./errors";
import { orderDetailSchema, trackOrderResponseSchema, type TrackOrderRequest } from "@/lib/validation/order";
import { mockDelay } from "@/lib/mock/delay";
import { mockOrders, mockTrackOrderIndex } from "@/lib/mock/orders";

export async function trackOrder(request: TrackOrderRequest) {
  if (env.useMockApi) {
    await mockDelay(400);
    const key = `${request.orderNumber.trim().toUpperCase()}|${request.contact.trim().toLowerCase()}`;
    const secureToken = mockTrackOrderIndex[key];
    if (!secureToken) {
      throw new NotFoundApiError(
        "We couldn't find an order matching those details. Please check your order number and contact info.",
      );
    }
    return { secureToken };
  }
  return apiFetch("/orders/track", trackOrderResponseSchema, {
    method: "POST",
    body: request,
  });
}

export async function getOrderByToken(secureToken: string) {
  if (env.useMockApi) {
    await mockDelay();
    const order = mockOrders[secureToken];
    if (!order) throw new NotFoundApiError("This order link is invalid or has expired.");
    return order;
  }
  return apiFetch(`/orders/${encodeURIComponent(secureToken)}`, orderDetailSchema);
}
