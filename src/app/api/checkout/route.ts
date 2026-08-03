import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { getSessionToken } from "@/lib/auth/session";
import { unauthorizedResponse } from "@/lib/auth/proxy";

// The browser can't attach the httpOnly customer-session cookie to a
// cross-origin request to admin-api itself, so checkout is relayed through
// this same-origin route: the browser calls us (cookie included
// automatically), and we call admin-api server-to-server with a bearer token.
export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse("Please sign in to check out.");
  const body = await request.text();
  const idempotencyKey = request.headers.get("idempotency-key") ?? "";
  const response = await fetch(`${env.apiBaseUrl}/checkout`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      "idempotency-key": idempotencyKey,
    },
    body,
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
