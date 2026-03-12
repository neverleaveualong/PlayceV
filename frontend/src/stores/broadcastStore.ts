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
  setStore: (r: string, rId: number) => void;
  setViewOption: (view: TViewOption) => void;
  tabRef: React.RefObject<HTMLDivElement> | null;
  itemRefs: React.RefObject<Map<number, HTMLDivElement>> | null;
  setTabRef: (ref: React.RefObject<HTMLDivElement>) => void;
  setItemRefs: (ref: React.RefObject<Map<number, HTMLDivElement>>) => void;

  scrollDateCenter: () => void;
}

const useBroadcastStore = create<BoradcastState>((set, get) => ({
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
  setStore: (_s: string, sId: number) => {
    set({ storeId: sId });
  },
  setViewOption: (view) => {
    set({ viewOption: view });
  },
  tabRef: null,
  itemRefs: null,
  setTabRef: (ref) => set({ tabRef: ref }),
  setItemRefs: (ref) => set({ itemRefs: ref }),

  scrollDateCenter: () => {
    const tabRef = get().tabRef?.current;
    const itemRefs = get().itemRefs?.current;
    const todayDate = get().date;

    if (tabRef && itemRefs) {
      const todayEl = itemRefs.get(todayDate);
      if (todayEl) {
        const scrollPos =
          todayEl.offsetLeft + todayEl.offsetWidth / 2 - tabRef.clientWidth / 2;

        tabRef.scrollTo({ left: scrollPos, behavior: "smooth" });
        get().setDate(todayDate);
      }
    }
  },
}));

export default useBroadcastStore;
