import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/auth/session";
import { getMyAddresses } from "@/lib/auth/accountData";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?next=/checkout");
  const addresses = await getMyAddresses();
  return <CheckoutPageClient account={account} addresses={addresses} />;
}
