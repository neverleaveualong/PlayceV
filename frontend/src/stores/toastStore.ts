import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  isExiting: boolean;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
  removeToast: (id: string) => void;
}

let toastCounter = 0;
const TOAST_DURATION = 3000;
const EXIT_ANIMATION_MS = 300;

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id, message, type, isExiting: false },
      ],
    }));
    setTimeout(() => get().dismissToast(id), TOAST_DURATION);
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, isExiting: true } : t
      ),
    }));
    setTimeout(() => get().removeToast(id), EXIT_ANIMATION_MS);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export default useToastStore;
