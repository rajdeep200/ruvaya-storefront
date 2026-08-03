import type { OrderDetail, OrderStatus, OrderTimelineStep } from "@/lib/validation/order";
import { mockImageUrl } from "./image";
import { mockProducts } from "./products";

const FULL_TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: "payment_received", label: "Payment received" },
  { status: "availability_being_verified", label: "Availability being verified" },
  { status: "order_confirmed", label: "Order confirmed" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];

function buildTimeline(reachedStatus: OrderStatus, startDate: string): OrderTimelineStep[] {
  const reachedIndex = FULL_TIMELINE.findIndex((s) => s.status === reachedStatus);
  const start = new Date(startDate);
  return FULL_TIMELINE.map((step, i) => ({
    status: step.status,
    label: step.label,
    completed: i <= reachedIndex,
    timestamp: i <= reachedIndex ? new Date(start.getTime() + i * 26 * 60 * 60 * 1000).toISOString() : null,
  }));
}

function findProduct(slug: string) {
  const product = mockProducts.find((p) => p.slug === slug)!;
  return product;
}

export const mockOrders: Record<string, OrderDetail> = {
  "order-token-shipped": {
    orderNumber: "RUV10234",
    secureToken: "order-token-shipped",
    status: "shipped",
    paymentStatus: "success",
    placedAt: "2026-07-24T09:12:00.000Z",
    items: [
      {
        productName: findProduct("pastel-pink-embroidered-kurti").name,
        productSlug: "pastel-pink-embroidered-kurti",
        image: { id: "order-item-1", url: mockImageUrl("Pastel Pink Embroidered Kurti", { tone: "rose", w: 300, h: 375 }), alt: "Pastel Pink Embroidered Kurti" },
        size: "M",
        color: "Pastel Pink",
        quantity: 1,
        unitPrice: 1299,
      },
    ],
    subtotal: 1299,
    discount: 0,
    shippingFee: 0,
    amountPaid: 1299,
    shippingAddress: {
      fullName: "Ananya Rao",
      addressLine: "14, Lakeview Residency, 3rd Cross",
      locality: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038",
    },
    timeline: buildTimeline("shipped", "2026-07-24T09:12:00.000Z"),
    estimatedDeliveryAt: "2026-07-30T18:00:00.000Z",
  },
  "order-token-delivered": {
    orderNumber: "RUV10198",
    secureToken: "order-token-delivered",
    status: "delivered",
    paymentStatus: "success",
    placedAt: "2026-07-10T14:30:00.000Z",
    items: [
      {
        productName: findProduct("ivory-floral-a-line-kurti").name,
        productSlug: "ivory-floral-a-line-kurti",
        image: { id: "order-item-2", url: mockImageUrl("Ivory Floral A-Line Kurti", { tone: "ivory", w: 300, h: 375 }), alt: "Ivory Floral A-Line Kurti" },
        size: "S",
        color: "Ivory",
        quantity: 2,
        unitPrice: 1299,
      },
    ],
    subtotal: 2598,
    discount: 100,
    shippingFee: 0,
    amountPaid: 2498,
    shippingAddress: {
      fullName: "Kavya Menon",
      addressLine: "22B, Palm Grove Apartments",
      locality: "Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560095",
    },
    timeline: buildTimeline("delivered", "2026-07-10T14:30:00.000Z"),
    estimatedDeliveryAt: null,
  },
};

export const mockTrackOrderIndex: Record<string, string> = {
  "RUV10234|+919876500001": "order-token-shipped",
  "RUV10234|ananya@example.com": "order-token-shipped",
  "RUV10198|+919876500002": "order-token-delivered",
  "RUV10198|kavya@example.com": "order-token-delivered",
};
