import { useToastStore, type ToastVariant } from "@/store/toast";

/** Toasts are for non-critical, transient messages only — never the sole surface for a checkout/payment error. */
export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    toast: (description: string, options?: { title?: string; variant?: ToastVariant }) =>
      push({ description, title: options?.title, variant: options?.variant }),
  };
}
