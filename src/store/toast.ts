import { create } from "zustand";

export type ToastVariant = "default" | "success" | "warning" | "error";

export type ToastItem = {
  id: string;
  description: string;
  title?: string;
  variant: ToastVariant;
};

type ToastState = {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id" | "variant"> & { variant?: ToastVariant }) => void;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`, variant: "default", ...toast },
      ],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
