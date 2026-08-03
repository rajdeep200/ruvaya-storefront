import type { Metadata } from "next";
import { User, Mail } from "lucide-react";
import { getCurrentAccount } from "@/lib/auth/session";
import { ProfileForm } from "@/components/account/ProfileForm";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountProfilePage() {
  const account = await getCurrentAccount();
  if (!account) return null; // layout already redirects; satisfies TS narrowing

  return (
    <Card className="max-w-lg">
      <CardContent className="gap-5 p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-primary">
            <User size={20} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-lg text-text-primary">Personal details</h2>
            <p className="text-sm text-text-secondary">Manage your personal information</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-text-primary">
            <Mail size={18} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-text-secondary">Email address</p>
            <p className="text-text-primary">{account.email}</p>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <ProfileForm account={account} />
        </div>
      </CardContent>
    </Card>
  );
}
