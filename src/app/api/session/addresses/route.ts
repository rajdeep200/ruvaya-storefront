import { NextRequest, NextResponse } from "next/server";
import { relayWithAuth, unauthorizedResponse } from "@/lib/auth/proxy";
import { getSessionToken } from "@/lib/auth/session";

export async function GET() {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse();
  const { status, json } = await relayWithAuth("/auth/me/addresses", token);
  return NextResponse.json(json, { status });
}

export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse();
  const body = await request.json();
  const { status, json } = await relayWithAuth("/auth/me/addresses", token, { method: "POST", body });
  return NextResponse.json(json, { status });
}
