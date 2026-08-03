import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProductListItem } from "@/types";

const MAX_ITEMS = 8;

type RecentlyViewedState = {
  items: ProductListItem[];
  addItem: (item: ProductListItem) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.id !== item.id)].slice(0, MAX_ITEMS),
        })),
    }),
    {
      name: "ruvaya-recently-viewed",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
