import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { env } from "@/config/env";

export const SESSION_COOKIE = "ruvaya_customer_session";

export type Account = { id: string; email: string; name: string; phone: string | null };

export async function setSessionCookie(token: string, expiresAt: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** Cached per request — safe to call from layout + page without duplicate fetches. */
export const getCurrentAccount = cache(async (): Promise<Account | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const response = await fetch(`${env.apiBaseUrl}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.success ? (json.data as Account) : null;
  } catch {
    return null;
  }
});
