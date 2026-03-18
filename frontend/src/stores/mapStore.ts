import { create } from "zustand";
import type { latlng, Bounds } from "@/types/map";
import { CITY_STATION, INITIAL_BOUNDS } from "@/constants/mapConstant";

interface MapState {
  position: latlng;
  myPosition: latlng;
  searchPosition: latlng;
  openedModal: number;
  bounds: Bounds;
  isRefreshBtnOn: boolean;
  zoomLevel: number;
  isSidebarOpen: boolean;
  selectedStoreId: number | null;
  setPosition: (pos: latlng) => void;
  initPosition: (pos: latlng) => void;
  search: (bounds: Bounds) => void;
  setOpenedModal: (modal: number) => void;
  closeModal: () => void;
  setRefreshBtn: (button: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  toggleSidebar: () => void;
  openDetail: (storeId: number) => void;
  closeDetail: () => void;
}

const useMapStore = create<MapState>((set, get) => ({
  position: CITY_STATION,
  myPosition: CITY_STATION,
  searchPosition: CITY_STATION,
  openedModal: -1,
  bounds: INITIAL_BOUNDS,
  isRefreshBtnOn: false,
  zoomLevel: 3,
  isSidebarOpen: true,
  selectedStoreId: null,
  setPosition: (pos) => {
    set({ position: pos });
  },
  initPosition: (pos) => {
    set({ position: pos, myPosition: pos, searchPosition: pos });
  },
  search: (bounds) => {
    set({ searchPosition: get().position, bounds, isRefreshBtnOn: false });
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
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
      selectedStoreId: state.isSidebarOpen ? null : state.selectedStoreId,
    }));
  },
  openDetail: (storeId) => {
    set({ selectedStoreId: storeId, isSidebarOpen: true });
  },
  closeDetail: () => {
    set({ selectedStoreId: null });
  },
}));

export default useMapStore;
