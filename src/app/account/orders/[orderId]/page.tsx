import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ShoppingBag, ClipboardList, MapPin, Package, MessageCircleQuestion, Sparkles, Star, type LucideIcon } from "lucide-react";
import { getMyOrderDetail } from "@/lib/auth/accountData";
import { formatDate, formatDateTime, formatInr } from "@/lib/formatting";
import { ORDER_STATUS_LABEL, ORDER_STATUS_HISTORY_LABEL, ORDER_STATUS_ICON, ORDER_STATUS_MESSAGE } from "@/lib/orderStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-primary">
        <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h3 className="font-serif text-base text-text-primary">{title}</h3>
    </div>
  );
}

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getMyOrderDetail(orderId);
  if (!order) notFound();

  const address = order.shippingAddress as {
    fullName?: string;
    addressLine?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  const CurrentStatusIcon = ORDER_STATUS_ICON[order.status] ?? Package;
  const statusLabel = ORDER_STATUS_LABEL[order.status] ?? order.status;

  return (
    <div className="flex flex-col gap-4">
      <Card className="border border-border shadow-none">
        <CardContent className="gap-1.5 p-6 text-center">
          <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Order</p>
          <h2 className="font-serif text-2xl text-text-primary">{order.orderNumber}</h2>
          <p className="text-sm text-text-secondary">Placed on {formatDate(order.createdAt)}</p>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-none">
        <CardContent className="gap-0 p-6">
          <h2 className="font-serif text-2xl text-text-primary">Order progress</h2>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-text-secondary">Current status</span>
            <Badge className="gap-1.5 px-3 py-1.5 text-xs normal-case tracking-normal">
              <CurrentStatusIcon size={14} strokeWidth={2} aria-hidden="true" />
              {statusLabel}
            </Badge>
          </div>

          <div className="mt-4 border-t border-border" />

          <ol className="mt-6 flex flex-col">
            {order.statusHistory.map((entry, i) => {
              const isLast = i === order.statusHistory.length - 1;
              const StepIcon = isLast ? CurrentStatusIcon : Check;
              return (
                <li key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${
                        isLast
                          ? "border-primary bg-primary text-white"
                          : "border-secondary/60 bg-surface text-text-primary"
                      }`}
                    >
                      <StepIcon size={18} strokeWidth={2} aria-hidden="true" />
                    </span>
                    {!isLast && <span className="w-0.5 flex-1 bg-secondary/50" aria-hidden="true" />}
                  </div>
                  <div className={isLast ? "pb-1" : "pb-8"}>
                    <p className="font-semibold text-text-primary">
                      {(isLast ? ORDER_STATUS_LABEL : ORDER_STATUS_HISTORY_LABEL)[entry.toStatus] ??
                        entry.toStatus}
                    </p>
                    <p className="mt-0.5 text-sm text-text-muted">{formatDateTime(entry.createdAt)}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-2 flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-text-secondary">
            <Sparkles size={16} strokeWidth={1.8} className="shrink-0 text-warning" aria-hidden="true" />
            {ORDER_STATUS_MESSAGE[order.status] ?? "We'll keep you updated."}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-none">
        <CardContent className="gap-4 p-5">
          <SectionHeader icon={ShoppingBag} title="Items" />
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.id} className="rounded-md border border-border bg-surface-muted/30 p-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-text-muted">
                        <Package size={16} strokeWidth={1.6} aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-text-secondary">
                    {item.productName} ({item.color}, {item.size}) × {item.quantity}
                  </span>
                  <span className="shrink-0 text-text-primary">{formatInr(item.total)}</span>
                </div>
                {item.reviewToken && (
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                    <p className="text-xs font-medium text-text-primary">Rate your experience</p>
                    <div className="flex flex-row-reverse gap-0.5">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <Link
                          key={star}
                          href={`/review/${item.reviewToken}?rating=${star}`}
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                          className="text-secondary/50 transition-colors hover:text-primary [&:hover~*]:text-primary"
                        >
                          <Star size={20} strokeWidth={1.6} fill="currentColor" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border border-border shadow-none">
          <CardContent className="gap-3 p-5">
            <SectionHeader icon={ClipboardList} title="Order Summary" />
            <dl className="flex flex-col gap-1.5 text-sm">
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
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-text-secondary">Shipping</dt>
                <dd>{order.shipping === 0 ? "Free" : formatInr(order.shipping)}</dd>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold text-text-primary">
                <dt>Total</dt>
                <dd>{formatInr(order.total)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none">
          <CardContent className="gap-3 p-5">
            <SectionHeader icon={MapPin} title="Shipping Address" />
            <div className="text-sm text-text-secondary">
              <p className="text-text-primary">{address.fullName}</p>
              <p>
                {address.addressLine}
                {address.locality ? `, ${address.locality}` : ""}
              </p>
              <p>
                {address.city}, {address.state} {address.pincode}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="h-auto min-h-11 flex-1 gap-2 rounded-md">
          <Link href="/track-order">
            <Package size={16} strokeWidth={1.8} aria-hidden="true" />
            Track Order
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto min-h-11 flex-1 gap-2 rounded-md">
          <Link href="/help">
            <MessageCircleQuestion size={16} strokeWidth={1.8} aria-hidden="true" />
            Need Help?
          </Link>
        </Button>
      </div>
    </div>
  );
}
