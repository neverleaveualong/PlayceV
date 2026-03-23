import { create } from "zustand";
import type { latlng, Bounds } from "@/types/map";
import { CITY_STATION, INITIAL_BOUNDS, BOUNDS_OFFSET } from "@/constants/mapConstant";

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
  detailInitialTab: string | null;
  pendingModalId: number | null;
  setPosition: (pos: latlng) => void;
  initPosition: (pos: latlng) => void;
  search: (bounds: Bounds, resetRefresh?: boolean) => void;
  setBounds: (bounds: Bounds) => void;
  setOpenedModal: (modal: number) => void;
  closeModal: () => void;
  setRefreshBtn: (button: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  toggleSidebar: () => void;
  openDetail: (storeId: number, initialTab?: string) => void;
  closeDetail: () => void;
  navigateToStore: (pos: { lat: number; lng: number }, bounds: Bounds, storeId: number) => void;
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
  detailInitialTab: null,
  pendingModalId: null,
  setPosition: (pos) => {
    set({ position: pos });
  },
  initPosition: (pos) => {
    const offset = BOUNDS_OFFSET;
    set({
      position: pos,
      myPosition: pos,
      searchPosition: pos,
      bounds: {
        swLat: pos.lat - offset,
        swLng: pos.lng - offset,
        neLat: pos.lat + offset,
        neLng: pos.lng + offset,
      },
    });
  },
  search: (bounds, resetRefresh = true) => {
    set({
      searchPosition: get().position,
      bounds,
      ...(resetRefresh && { isRefreshBtnOn: false }),
    });
  },
  setBounds: (bounds) => {
    set({ bounds });
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
  openDetail: (storeId, initialTab) => {
    set({ selectedStoreId: storeId, isSidebarOpen: true, detailInitialTab: initialTab ?? null });
  },
  closeDetail: () => {
    set({ selectedStoreId: null, detailInitialTab: null, pendingModalId: null, openedModal: -1 });
  },
  navigateToStore: (pos, bounds, storeId) => {
    set({ position: pos, bounds, isRefreshBtnOn: false, pendingModalId: storeId });
  },
}));

export default useMapStore;
