"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";

export function AccountLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await logout();
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleLogout}
      disabled={busy}
      className="h-auto min-h-11 gap-2 rounded-md px-3 text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-error disabled:opacity-60"
    >
      <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />
      {busy ? "Signing out..." : "Logout"}
    </Button>
  );
}
