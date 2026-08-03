"use client";

import * as Toast from "@radix-ui/react-toast";
import { useToastStore } from "@/store/toast";

const VARIANT_CLASSES: Record<string, string> = {
  default: "border-border bg-surface text-text-primary",
  success: "border-success/30 bg-surface text-success",
  error: "border-error/30 bg-surface text-error",
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      {toasts.map((t) => (
        <Toast.Root
          key={t.id}
          className={`relative rounded-md border px-4 py-3 pr-8 shadow-md transition-opacity ${VARIANT_CLASSES[t.variant]}`}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
        >
          {t.title && <Toast.Title className="text-sm font-medium">{t.title}</Toast.Title>}
          <Toast.Description className="text-sm text-text-secondary">{t.description}</Toast.Description>
          <Toast.Close aria-label="Dismiss notification" className="absolute right-2 top-2 text-text-muted">
            ×
          </Toast.Close>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none sm:bottom-6 sm:right-6" />
    </Toast.Provider>
  );
}
