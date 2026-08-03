import "server-only";
import { NextResponse } from "next/server";
import { env } from "@/config/env";

export function unauthorizedResponse(message = "Please sign in to continue.") {
  return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message } }, { status: 401 });
}

/** POSTs to an admin-api /auth/* endpoint and returns its raw envelope + status, for relaying by a route handler. */
export async function forwardAuthRequest(path: string, body: unknown, token?: string) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return { ok: response.ok, status: response.status, json };
}

/** Bearer-authenticated relay to any admin-api endpoint (profile, addresses, orders). */
export async function relayWithAuth(
  path: string,
  token: string,
  init?: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown },
) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      authorization: `Bearer ${token}`,
      ...(init?.body !== undefined ? { "content-type": "application/json" } : {}),
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  const json = await response.json();
  return { ok: response.ok, status: response.status, json };
}
