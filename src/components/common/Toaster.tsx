"use client";

import * as Toast from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast";

const toastVariants = cva(
  "relative flex w-full items-start gap-3 rounded-lg border border-l-4 bg-surface p-4 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=closed]:animate-out data-[state=closed]:fade-out-80",
  {
    variants: {
      variant: {
        default: "border-border text-text-primary",
        success: "border-l-success text-success",
        warning: "border-l-warning text-warning",
        error: "border-l-error text-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const VARIANT_ICON: Record<NonNullable<VariantProps<typeof toastVariants>["variant"]>, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      {toasts.map((t) => {
        const Icon = VARIANT_ICON[t.variant];
        return (
          <Toast.Root
            key={t.id}
            data-slot="toast"
            className={cn(toastVariants({ variant: t.variant }))}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id);
            }}
          >
            <Icon size={18} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              {t.title && <Toast.Title className="text-sm font-semibold">{t.title}</Toast.Title>}
              <Toast.Description className="text-sm text-text-primary">{t.description}</Toast.Description>
            </div>
            <Toast.Close aria-label="Dismiss notification" className="absolute right-2 top-2 text-text-muted">
              ×
            </Toast.Close>
          </Toast.Root>
        );
      })}
      <Toast.Viewport className="fixed top-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none sm:top-6 sm:right-6" />
    </Toast.Provider>
  );
}
