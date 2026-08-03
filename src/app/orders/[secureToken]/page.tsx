import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByToken } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/errors";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate, formatInr } from "@/lib/formatting";
import type { OrderDetail } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  created: "Payment being set up",
  pending: "Payment verification in progress",
  success: "Payment received",
  failed: "Payment failed",
  cancelled: "Payment cancelled",
  user_dropped: "Payment not completed",
  expired: "Payment session expired",
};

async function loadOrder(secureToken: string): Promise<{ order: OrderDetail | null; isExpired: boolean }> {
  try {
    const order = await getOrderByToken(secureToken);
    return { order, isExpired: false };
  } catch (error) {
    if (error instanceof ApiError && error.code === "AUTH_EXPIRED") {
      return { order: null, isExpired: true };
    }
    if (error instanceof ApiError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}

export default async function SecureOrderPage({
  params,
}: {
  params: Promise<{ secureToken: string }>;
}) {
  const { secureToken } = await params;
  const { order, isExpired } = await loadOrder(secureToken);

  if (isExpired || !order) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <EmptyState
          title="This order link has expired"
          description="For your security, order links expire after a period of time. Look up your order again using your order number and contact details."
          action={
            <Link href="/track-order" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
              Track Order
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-2xl text-text-primary uppercase">Order {order.orderNumber}</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Placed on {formatDate(order.placedAt)} · {PAYMENT_STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-4 text-xs font-semibold tracking-wide text-text-primary uppercase">Order Status</h2>
          <OrderTimeline steps={order.timeline} />

          <h2 className="mt-10 mb-4 text-xs font-semibold tracking-wide text-text-primary uppercase">Items</h2>
          <ul className="flex flex-col gap-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-surface-muted">
                  <Image src={item.image.url} alt={item.image.alt} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.productSlug}`} className="text-sm font-medium text-text-primary hover:text-primary">
                    {item.productName}
                  </Link>
                  <p className="text-xs text-text-secondary">
                    {item.color} · Size {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-text-primary">{formatInr(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="rounded-md border border-border p-5">
            <h2 className="mb-3 text-xs font-semibold tracking-wide text-text-primary uppercase">Order Summary</h2>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Subtotal</dt>
                <dd>{formatInr(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Discount</dt>
                  <dd className="text-success">−{formatInr(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-text-secondary">Shipping</dt>
                <dd>{order.shippingFee === 0 ? "Free" : formatInr(order.shippingFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
                <dt>Amount Paid</dt>
                <dd>{formatInr(order.amountPaid)}</dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-border pt-4 text-sm text-text-secondary">
              <p className="mb-1 text-xs font-semibold tracking-wide text-text-primary uppercase">Shipping Address</p>
              <p>{order.shippingAddress.fullName}</p>
              <p>
                {order.shippingAddress.addressLine}
                {order.shippingAddress.locality ? `, ${order.shippingAddress.locality}` : ""}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          <Link
            href="/help"
            className="mt-4 block rounded-sm border border-border px-4 py-3 text-center text-sm font-medium text-text-primary hover:border-primary"
          >
            Need help with this order? WhatsApp Us
          </Link>
        </div>
      </div>
    </div>
  );
}
