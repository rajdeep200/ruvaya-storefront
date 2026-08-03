import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ImageAsset, Money } from "@/types";

export type WishlistItem = {
  productId: string;
  productSlug: string;
  productName: string;
  image: ImageAsset;
  price: Money;
  salePrice: Money | null;
  addedAt: string;
};

type WishlistState = {
  items: WishlistItem[];
  add: (item: Omit<WishlistItem, "addedAt">) => void;
  remove: (productId: string) => void;
  toggle: (item: Omit<WishlistItem, "addedAt">) => void;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) return state;
          return { items: [...state.items, { ...item, addedAt: new Date().toISOString() }] };
        }),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      toggle: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          get().remove(item.productId);
        } else {
          get().add(item);
        }
      },

      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),
    }),
    {
      name: "ruvaya-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
