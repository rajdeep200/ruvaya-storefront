import { NextRequest, NextResponse } from "next/server";
import { forwardAuthRequest } from "@/lib/auth/proxy";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ok, status, json } = await forwardAuthRequest("/auth/google", body);
  if (!ok) return NextResponse.json(json, { status });
  await setSessionCookie(json.data.token, json.data.expiresAt);
  return NextResponse.json({ success: true, data: json.data.account });
}
