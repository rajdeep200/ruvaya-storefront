import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/components/order/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <OrderConfirmationClient orderNumber={orderNumber} />;
}
