"use client";

import Image from "next/image";
import Link from "next/link";
import { useLastOrderStore } from "@/store/lastOrder";
import { RuvayaLogo } from "@/components/common/RuvayaLogo";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/formatting";

export function OrderConfirmationClient({ orderNumber }: { orderNumber: string }) {
  const order = useLastOrderStore((s) => s.order);

  if (!order || order.orderNumber !== orderNumber) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <RuvayaLogo size={56} className="mx-auto" />
        <h1 className="mt-6 font-serif text-2xl text-text-primary">Order {orderNumber}</h1>
        <p className="mt-3 text-sm text-text-secondary">
          We can&apos;t show full details for this order on this device. For your security, order details are only
          shown right after checkout — use Track Order any time to look it up with your order number and contact
          details.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="h-auto min-h-11 rounded-sm px-6 py-3">
            <Link href="/account/orders">View My Orders</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto min-h-11 rounded-sm px-6 py-3">
            <Link href="/track-order">Track This Order</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto min-h-11 rounded-sm px-6 py-3">
            <Link href="/help">Contact Support</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 text-center">
      <RuvayaLogo size={64} className="mx-auto" />
      <p className="mt-6 text-xs font-medium tracking-[0.2em] text-success uppercase">Payment Received</p>
      <h1 className="mt-2 font-serif text-3xl text-text-primary">Thank you for your order!</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Order <span className="font-medium text-text-primary">{order.orderNumber}</span> is confirmed. We&apos;re
        verifying availability and will begin processing shortly.
      </p>

      <div className="mt-8 rounded-md border border-border p-6 text-left">
        <ul className="flex flex-col gap-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-surface-muted">
                <Image src={item.image.url} alt={item.image.alt} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{item.productName}</p>
                <p className="text-xs text-text-secondary">
                  {item.colorName} · Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm text-text-primary">{formatInr(item.unitPrice * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-medium">
          <span className="text-text-primary">Amount Paid</span>
          <span className="text-text-primary">{formatInr(order.amountPaid)}</span>
        </div>

        <div className="mt-4 border-t border-border pt-4 text-sm text-text-secondary">
          <p className="mb-1 text-xs font-semibold tracking-wide text-text-primary uppercase">Shipping To</p>
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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="h-auto min-h-11 rounded-sm px-6 py-3">
          <Link href="/account/orders">View My Orders</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto min-h-11 rounded-sm px-6 py-3">
          <Link href="/help">Need Help? WhatsApp Us</Link>
        </Button>
      </div>
    </div>
  );
}
