import { create } from "zustand";

interface BroadcastFormState {
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}

const useBroadcastFormStore = create<BroadcastFormState>((set) => ({
  editingId: null,
  setEditingId: (id) => set({ editingId: id }),
}));

export default useBroadcastFormStore;
