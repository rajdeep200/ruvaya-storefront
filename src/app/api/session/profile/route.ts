import { NextRequest, NextResponse } from "next/server";
import { relayWithAuth, unauthorizedResponse } from "@/lib/auth/proxy";
import { getSessionToken } from "@/lib/auth/session";

export async function PATCH(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse();
  const body = await request.json();
  const { status, json } = await relayWithAuth("/auth/me", token, { method: "PATCH", body });
  return NextResponse.json(json, { status });
}
