import { NextResponse } from "next/server";
import { relayWithAuth, unauthorizedResponse } from "@/lib/auth/proxy";
import { getSessionToken } from "@/lib/auth/session";

export async function GET() {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse();
  const { status, json } = await relayWithAuth("/auth/me/orders", token);
  return NextResponse.json(json, { status });
}
