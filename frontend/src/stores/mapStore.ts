import { create } from "zustand";
import type { latlng } from "@/types/map";
import { CITY_STATION, SEARCHNEARBY_RADIUS } from "@/constants/mapConstant";

interface MapState {
  position: latlng;
  searchPosition: latlng;
  openedModal: number;
  radius: number;
  isRefreshBtnOn: boolean;
  zoomLevel: number;
  isSidebarOpen: boolean;
  setPosition: (pos: latlng) => void;
  initPosition: (pos: latlng) => void;
  search: (radius: number) => void;
  setOpenedModal: (modal: number) => void;
  closeModal: () => void;
  setRefreshBtn: (button: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  toggleSidebar: () => void;
}

const useMapStore = create<MapState>((set, get) => ({
  position: CITY_STATION,
  searchPosition: CITY_STATION,
  openedModal: -1,
  radius: SEARCHNEARBY_RADIUS,
  isRefreshBtnOn: false,
  zoomLevel: 3,
  isSidebarOpen: true,
  setPosition: (pos) => {
    set({ position: pos });
  },
  initPosition: (pos) => {
    set({ position: pos, searchPosition: pos });
  },
  search: (radius) => {
    set({ searchPosition: get().position, radius, isRefreshBtnOn: false });
  },
  setOpenedModal: (modal) => {
    set({ openedModal: modal });
  },
  closeModal: () => {
    set({ openedModal: -1 });
  },
  setRefreshBtn: (button) => {
    set({ isRefreshBtnOn: button });
  },
  setZoomLevel: (zoom) => {
    set({ zoomLevel: zoom });
  },
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
}));

export default useMapStore;
