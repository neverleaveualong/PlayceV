import { create } from "zustand";
import { getToday } from "@/utils/dateUtils";

export const dateInfo = getToday();

type TViewOption = "tab" | "calendar";

interface BoradcastState {
  year: number;
  month: number;
  date: number;
  storeId: number;
  viewOption: TViewOption;
  resetYMD: () => void;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDate: (date: number) => void;
  setStore: (storeId: number) => void;
  setViewOption: (view: TViewOption) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}

const useBroadcastStore = create<BoradcastState>((set) => ({
  year: dateInfo.year,
  month: dateInfo.month,
  date: dateInfo.date,
  storeId: 0,
  viewOption: "tab",
  resetYMD: () => {
    set({
      year: dateInfo.year,
      month: dateInfo.month,
      date: dateInfo.date,
    });
  },
  setYear: (year) => {
    set({ year: year });
  },
  setMonth: (month) => {
    set({ month: month });
  },
  setDate: (date) => {
    set({ date: date });
  },
  setStore: (storeId) => {
    set({ storeId });
  },
  setViewOption: (view) => {
    set({ viewOption: view });
  },
  editingId: null,
  setEditingId: (id) => set({ editingId: id }),
}));

export default useBroadcastStore;
