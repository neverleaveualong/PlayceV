import { create } from "zustand";
import type { ExtendedSubpage } from "@/types/restaurant-manage.types";

type TabType = "profile" | "restaurant" | "broadcast";

interface MypageState {
  isMypageOpen: boolean;
  selectedTab: TabType;
  restaurantSubpage: ExtendedSubpage;
  restaurantEditId: number | null;
  restaurantEditName: string | null;
  setIsMypageOpen: (mypage: boolean) => void;
  setSelectedTab: (tab: TabType) => void;
  setRestaurantSubpage: (subpage: ExtendedSubpage) => void;
  setRestaurantEditId: (restaurant: number | null) => void;
  setRestaurantEditName: (restaurant: string | null) => void;
}

const useMypageStore = create<MypageState>((set) => ({
  isMypageOpen: false,
  selectedTab: "profile",
  restaurantSubpage: "restaurant-home",
  restaurantEditId: null,
  restaurantEditName: null,
  setIsMypageOpen: (mypage) => {
    if (mypage) {
      set({ isMypageOpen: true });
    } else {
      set({
        isMypageOpen: false,
        selectedTab: "profile",
        restaurantSubpage: "restaurant-home",
        restaurantEditId: null,
        restaurantEditName: null,
      });
    }
  },
  setSelectedTab: (tab) => {
    set({ selectedTab: tab });
  },
  setRestaurantSubpage: (subpage) => {
    set({ restaurantSubpage: subpage });
  },
  setRestaurantEditId: (restaurant) => {
    set({ restaurantEditId: restaurant });
  },
  setRestaurantEditName: (restaurant) => {
    set({ restaurantEditName: restaurant });
  },
}));

export default useMypageStore;
