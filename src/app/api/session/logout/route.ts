import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { getSessionToken, clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  const token = await getSessionToken();
  if (token) {
    await fetch(`${env.apiBaseUrl}/auth/logout`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  await clearSessionCookie();
  return NextResponse.json({ success: true, data: { loggedOut: true } });
}
