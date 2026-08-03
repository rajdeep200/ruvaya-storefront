import { NextRequest, NextResponse } from "next/server";
import { relayWithAuth, unauthorizedResponse } from "@/lib/auth/proxy";
import { getSessionToken } from "@/lib/auth/session";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse();
  const body = await request.json();
  const { id } = await params;
  const { status, json } = await relayWithAuth(`/auth/me/addresses/${id}`, token, { method: "PATCH", body });
  return NextResponse.json(json, { status });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  if (!token) return unauthorizedResponse();
  const { id } = await params;
  const { status, json } = await relayWithAuth(`/auth/me/addresses/${id}`, token, { method: "DELETE" });
  return NextResponse.json(json, { status });
}
