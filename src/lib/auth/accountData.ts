import "server-only";
import { z } from "zod";
import { env } from "@/config/env";
import { getSessionToken } from "./session";
import { accountOrderSummarySchema, accountOrderDetailSchema, accountAddressSchema } from "@/lib/validation/auth";

// Server-only reads, called directly from Server Components. These fetch
// admin-api directly (server-to-server, bearer token) rather than going
// through the /api/session/* proxy routes — those exist for the *browser*,
// which can't resolve a relative URL without window.location the way
// Node's fetch can't either. Mutations (create/update/delete) still go
// through the client-side proxy routes from interactive components.

async function authedGet(path: string) {
  const token = await getSessionToken();
  if (!token) return null;
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const json = await response.json();
  return json.success ? json.data : null;
}

export async function getMyOrders() {
  const data = await authedGet("/auth/me/orders");
  const parsed = z.array(accountOrderSummarySchema).safeParse(data);
  return parsed.success ? parsed.data : [];
}

export async function getMyOrderDetail(orderId: string) {
  const data = await authedGet(`/auth/me/orders/${orderId}`);
  const parsed = accountOrderDetailSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function getMyAddresses() {
  const data = await authedGet("/auth/me/addresses");
  const parsed = z.array(accountAddressSchema).safeParse(data);
  return parsed.success ? parsed.data : [];
}
