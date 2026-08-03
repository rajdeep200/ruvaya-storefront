import type { Metadata } from "next";
import { getMyAddresses } from "@/lib/auth/accountData";
import { AddressBook } from "@/components/account/AddressBook";

export const metadata: Metadata = {
  title: "My Addresses",
  robots: { index: false, follow: false },
};

export default async function AccountAddressesPage() {
  const addresses = await getMyAddresses();
  return <AddressBook initialAddresses={addresses} />;
}
