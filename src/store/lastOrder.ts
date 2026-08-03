import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ImageAsset } from "@/types";

export type LastOrderItemSnapshot = {
  productName: string;
  image: ImageAsset;
  size: string;
  colorName: string;
  quantity: number;
  unitPrice: number;
};

export type LastOrderSnapshot = {
  orderNumber: string;
  amountPaid: number;
  placedAt: string;
  items: LastOrderItemSnapshot[];
  shippingAddress: {
    fullName: string;
    addressLine: string;
    locality?: string;
    city: string;
    state: string;
    pincode: string;
  };
};

type LastOrderState = {
  order: LastOrderSnapshot | null;
  setOrder: (order: LastOrderSnapshot) => void;
  clear: () => void;
};

/**
 * /order-confirmation/[orderNumber] intentionally never fetches by bare
 * order number from the backend — that number is human-readable and
 * guessable, not an opaque secure token. This store only renders the
 * confirmation using data from THIS browser's own just-completed checkout;
 * anyone else opening the same URL sees the safe fallback instead. Durable,
 * revisit-anytime order details live at /orders/[secureToken].
 */
export const useLastOrderStore = create<LastOrderState>()(
  persist(
    (set) => ({
      order: null,
      setOrder: (order) => set({ order }),
      clear: () => set({ order: null }),
    }),
    {
      name: "ruvaya-last-order",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
