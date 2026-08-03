import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CheckoutFormValues } from "@/types";

export type PendingOrder = {
  orderId: string;
  orderNumber: string;
  paymentSessionId: string;
  paymentGatewayOrderId: string;
  amount: number;
};

type CheckoutDraftState = {
  formValues: Partial<CheckoutFormValues> | null;
  /** Reused across retries of the same attempt so a network retry can't create a duplicate order. */
  idempotencyKey: string | null;
  pendingOrder: PendingOrder | null;
  setFormValues: (values: Partial<CheckoutFormValues>) => void;
  ensureIdempotencyKey: () => string;
  resetIdempotencyKey: () => void;
  setPendingOrder: (order: PendingOrder) => void;
  clearPendingOrder: () => void;
  clearDraft: () => void;
};

function generateKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `key-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useCheckoutDraftStore = create<CheckoutDraftState>()(
  persist(
    (set, get) => ({
      formValues: null,
      idempotencyKey: null,
      pendingOrder: null,

      setFormValues: (values) => set((state) => ({ formValues: { ...state.formValues, ...values } })),

      ensureIdempotencyKey: () => {
        const existing = get().idempotencyKey;
        if (existing) return existing;
        const key = generateKey();
        set({ idempotencyKey: key });
        return key;
      },

      resetIdempotencyKey: () => set({ idempotencyKey: null }),

      setPendingOrder: (order) => set({ pendingOrder: order }),
      clearPendingOrder: () => set({ pendingOrder: null }),

      clearDraft: () => set({ formValues: null, idempotencyKey: null, pendingOrder: null }),
    }),
    {
      name: "ruvaya-checkout-draft",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
