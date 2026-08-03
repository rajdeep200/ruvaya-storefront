import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, ChevronRight, Clock } from "lucide-react";
import { getMyOrders } from "@/lib/auth/accountData";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate, formatInr } from "@/lib/formatting";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, ORDER_STATUS_ICON } from "@/lib/orderStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "My Orders",
  robots: { index: false, follow: false },
};

export default async function AccountOrdersPage() {
  const orders = await getMyOrders();

  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold tracking-wide text-text-primary uppercase">Orders</h2>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Your placed orders will show up here." />
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => {
            const StatusIcon = ORDER_STATUS_ICON[order.status] ?? Clock;
            return (
              <li key={order.id}>
                <Link href={`/account/orders/${order.id}`} className="block">
                  <Card className="border border-border shadow-none">
                    <CardContent className="gap-0 p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                          {order.previewItem?.imageUrl ? (
                            <Image
                              src={order.previewItem.imageUrl}
                              alt=""
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-text-muted">
                              <Package size={18} strokeWidth={1.6} aria-hidden="true" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate font-serif text-base text-text-primary">
                              {order.previewItem
                                ? order.previewItem.productName +
                                  (order.itemCount > 1 ? ` +${order.itemCount - 1} more` : "")
                                : order.orderNumber}
                            </p>
                            <p className="shrink-0 text-base font-semibold text-text-primary">
                              {formatInr(order.total)}
                            </p>
                          </div>
                          {order.previewItem && (
                            <p className="truncate text-xs text-text-secondary">{order.orderNumber}</p>
                          )}
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                            <Calendar size={13} strokeWidth={1.8} aria-hidden="true" />
                            {formatDate(order.createdAt)} · {order.itemCount} item
                            {order.itemCount === 1 ? "" : "s"}
                          </p>
                          <Badge
                            variant={ORDER_STATUS_TONE[order.status] ?? "secondary"}
                            className="mt-2 gap-1 text-xs normal-case tracking-normal"
                          >
                            <StatusIcon size={12} strokeWidth={2} aria-hidden="true" />
                            {ORDER_STATUS_LABEL[order.status] ?? order.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm text-text-secondary">
                        View details
                        <ChevronRight size={16} strokeWidth={1.8} className="text-text-muted" aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
