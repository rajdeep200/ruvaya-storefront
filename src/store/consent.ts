import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ConsentState = {
  hasResponded: boolean;
  /** Essential operational analytics (our own /analytics/events) always run — this only gates GA4/Meta. */
  marketingConsent: boolean;
  acceptAll: () => void;
  essentialOnly: () => void;
};

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasResponded: false,
      marketingConsent: false,
      acceptAll: () => set({ hasResponded: true, marketingConsent: true }),
      essentialOnly: () => set({ hasResponded: true, marketingConsent: false }),
    }),
    {
      name: "ruvaya-consent",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
