import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getCurrentAccount } from "@/lib/auth/session";
import { AccountTabs } from "@/components/account/AccountTabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/formatting";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?next=/account");

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-primary uppercase">My Account</h1>
          <p className="mt-1 flex items-center gap-1.5 text-text-secondary">
            Hi, {account.name}
            <Sparkles size={16} strokeWidth={1.8} className="text-warning" aria-hidden="true" />
          </p>
        </div>
        <Avatar className="h-16 w-16 shrink-0 text-xl">
          <AvatarFallback>{getInitials(account.name)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="mt-8">
        <AccountTabs />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
