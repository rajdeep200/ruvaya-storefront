import { env } from "@/config/env";
import { loadCashfreeScript } from "./loadSdk";

/**
 * Opens Cashfree Hosted Checkout for a `paymentSessionId` the backend
 * created. This module never sees a client secret, webhook secret, or
 * refund credential — those stay in ruvaya-admin-api. `redirectTarget:
 * "_self"` follows Cashfree's documented hosted-checkout redirect flow: the
 * browser navigates to Cashfree, then back to the `return_url` the backend
 * configured when creating the order (our /payment/status page).
 */
export async function openCashfreeCheckout(paymentSessionId: string): Promise<void> {
  await loadCashfreeScript();
  if (!window.Cashfree) {
    throw new Error("Cashfree SDK failed to initialise.");
  }
  const cashfree = window.Cashfree({ mode: env.cashfreeMode });
  const result = await cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
  if (result.error) {
    throw new Error(result.error.message);
  }
}
