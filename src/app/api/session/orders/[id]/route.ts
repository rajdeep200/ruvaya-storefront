import { NextRequest, NextResponse } from "next/server";
import { relayWithAuth, unauthorizedResponse } from "@/lib/auth/proxy";
import { getSessionToken } from "@/lib/auth/session";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse();
  const { id } = await params;
  const { status, json } = await relayWithAuth(`/auth/me/orders/${id}`, token);
  return NextResponse.json(json, { status });
}
