import type { Metadata } from "next";
import { PaymentStatusClient } from "@/components/payment/PaymentStatusClient";

export const metadata: Metadata = {
  title: "Payment Status",
  robots: { index: false, follow: false },
};

export default function PaymentStatusPage() {
  return <PaymentStatusClient />;
}
