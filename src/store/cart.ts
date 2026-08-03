import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ImageAsset } from "@/types";

const MAX_QUANTITY_PER_LINE = 5;

export type CartLine = {
  lineId: string;
  productId: string;
  productSlug: string;
  productName: string;
  image: ImageAsset;
  colorId: string;
  colorName: string;
  colorHex: string;
  size: string;
  quantity: number;
  /**
   * Optimistic display prices only, captured at add-to-cart time. The
   * backend's /cart/validate response is the source of truth — these
   * snapshots exist purely so the cart drawer isn't blank while that
   * request is in flight, and must never be trusted at checkout.
   */
  unitPriceSnapshot: number;
  unitSalePriceSnapshot: number | null;
};

export function buildCartLineId(productId: string, colorId: string, size: string): string {
  return `${productId}::${colorId}::${size}`;
}

type CartState = {
  lines: CartLine[];
  couponCode: string | null;
  isDrawerOpen: boolean;
  addLine: (input: Omit<CartLine, "lineId" | "quantity"> & { quantity?: number }) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  setCouponCode: (code: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      couponCode: null,
      isDrawerOpen: false,

      addLine: (input) => {
        const lineId = buildCartLineId(input.productId, input.colorId, input.size);
        set((state) => {
          const existing = state.lines.find((l) => l.lineId === lineId);
          const addedQuantity = input.quantity ?? 1;

          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.lineId === lineId
                  ? { ...l, quantity: Math.min(l.quantity + addedQuantity, MAX_QUANTITY_PER_LINE) }
                  : l,
              ),
            };
          }

          return {
            lines: [
              ...state.lines,
              { ...input, lineId, quantity: Math.min(addedQuantity, MAX_QUANTITY_PER_LINE) },
            ],
          };
        });
      },

      removeLine: (lineId) => set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),

      setQuantity: (lineId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.lineId === lineId
              ? { ...l, quantity: Math.max(1, Math.min(quantity, MAX_QUANTITY_PER_LINE)) }
              : l,
          ),
        })),

      clearCart: () => set({ lines: [], couponCode: null }),
      setCouponCode: (code) => set({ couponCode: code }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    }),
    {
      name: "ruvaya-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines, couponCode: state.couponCode }),
    },
  ),
);

export const MAX_CART_LINE_QUANTITY = MAX_QUANTITY_PER_LINE;
