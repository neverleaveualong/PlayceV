import { describe, it, expect, beforeEach } from "vitest";
import useMapStore from "@/stores/mapStore";
import { CITY_STATION, INITIAL_BOUNDS, BOUNDS_OFFSET } from "@/constants/mapConstant";

beforeEach(() => {
  useMapStore.setState({
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
  });
});

describe("mapStore", () => {
  describe("초기 상태", () => {
    it("position이 CITY_STATION", () => {
      expect(useMapStore.getState().position).toEqual(CITY_STATION);
    });

    it("openedModal이 -1 (닫힘)", () => {
      expect(useMapStore.getState().openedModal).toBe(-1);
    });

    it("sidebarOpen이 true", () => {
      expect(useMapStore.getState().isSidebarOpen).toBe(true);
    });

    it("selectedStoreId가 null", () => {
      expect(useMapStore.getState().selectedStoreId).toBe(null);
    });
  });

  describe("setPosition", () => {
    it("position만 변경, 나머지 유지", () => {
      const pos = { lat: 35.0, lng: 129.0 };
      useMapStore.getState().setPosition(pos);
      expect(useMapStore.getState().position).toEqual(pos);
      expect(useMapStore.getState().myPosition).toEqual(CITY_STATION);
    });
  });

  describe("initPosition", () => {
    it("position + myPosition + searchPosition + bounds 모두 갱신", () => {
      const pos = { lat: 35.0, lng: 129.0 };
      useMapStore.getState().initPosition(pos);

      const state = useMapStore.getState();
      expect(state.position).toEqual(pos);
      expect(state.myPosition).toEqual(pos);
      expect(state.searchPosition).toEqual(pos);
      expect(state.bounds).toEqual({
        swLat: pos.lat - BOUNDS_OFFSET,
        swLng: pos.lng - BOUNDS_OFFSET,
        neLat: pos.lat + BOUNDS_OFFSET,
        neLng: pos.lng + BOUNDS_OFFSET,
      });
    });
  });

  describe("setBounds", () => {
    it("bounds만 변경", () => {
      const bounds = { swLat: 35, swLng: 128, neLat: 36, neLng: 130 };
      useMapStore.getState().setBounds(bounds);
      expect(useMapStore.getState().bounds).toEqual(bounds);
      expect(useMapStore.getState().position).toEqual(CITY_STATION);
    });
  });

  describe("setZoomLevel", () => {
    it("zoomLevel 변경", () => {
      useMapStore.getState().setZoomLevel(7);
      expect(useMapStore.getState().zoomLevel).toBe(7);
    });
  });

  describe("search", () => {
    it("bounds + searchPosition 갱신, refreshBtn 리셋", () => {
      const pos = { lat: 35.0, lng: 129.0 };
      useMapStore.getState().setPosition(pos);
      useMapStore.getState().setRefreshBtn(true);

      const bounds = { swLat: 35, swLng: 128, neLat: 36, neLng: 130 };
      useMapStore.getState().search(bounds);

      const state = useMapStore.getState();
      expect(state.bounds).toEqual(bounds);
      expect(state.searchPosition).toEqual(pos);
      expect(state.isRefreshBtnOn).toBe(false);
    });

    it("resetRefresh=false면 refreshBtn 유지", () => {
      useMapStore.getState().setRefreshBtn(true);
      const bounds = { swLat: 35, swLng: 128, neLat: 36, neLng: 130 };
      useMapStore.getState().search(bounds, false);
      expect(useMapStore.getState().isRefreshBtnOn).toBe(true);
    });
  });

  describe("모달 상태", () => {
    it("setOpenedModal → closeModal", () => {
      useMapStore.getState().setOpenedModal(42);
      expect(useMapStore.getState().openedModal).toBe(42);

      useMapStore.getState().closeModal();
      expect(useMapStore.getState().openedModal).toBe(-1);
    });
  });

  describe("toggleSidebar", () => {
    it("true → false → true", () => {
      expect(useMapStore.getState().isSidebarOpen).toBe(true);
      useMapStore.getState().toggleSidebar();
      expect(useMapStore.getState().isSidebarOpen).toBe(false);
      useMapStore.getState().toggleSidebar();
      expect(useMapStore.getState().isSidebarOpen).toBe(true);
    });
  });

  describe("openDetail / closeDetail", () => {
    it("openDetail → selectedStoreId + sidebar open", () => {
      useMapStore.getState().toggleSidebar();
      useMapStore.getState().openDetail(123);

      const state = useMapStore.getState();
      expect(state.selectedStoreId).toBe(123);
      expect(state.isSidebarOpen).toBe(true);
      expect(state.detailInitialTab).toBe(null);
    });

    it("openDetail with initialTab", () => {
      useMapStore.getState().openDetail(123, "중계");
      expect(useMapStore.getState().detailInitialTab).toBe("중계");
    });

    it("closeDetail → 모든 상세 상태 초기화", () => {
      useMapStore.getState().openDetail(123, "중계");
      useMapStore.getState().setOpenedModal(5);
      useMapStore.setState({ pendingModalId: 10 });

      useMapStore.getState().closeDetail();

      const state = useMapStore.getState();
      expect(state.selectedStoreId).toBe(null);
      expect(state.detailInitialTab).toBe(null);
      expect(state.pendingModalId).toBe(null);
      expect(state.openedModal).toBe(-1);
    });
  });

  describe("navigateToStore", () => {
    it("position + bounds + pendingModalId 설정, selectedStoreId는 변경 안 됨", () => {
      const pos = { lat: 37.5, lng: 127.0 };
      const bounds = { swLat: 37.45, swLng: 126.95, neLat: 37.55, neLng: 127.05 };

      useMapStore.getState().setRefreshBtn(true);
      useMapStore.getState().navigateToStore(pos, bounds, 99);

      const state = useMapStore.getState();
      expect(state.position).toEqual(pos);
      expect(state.bounds).toEqual(bounds);
      expect(state.pendingModalId).toBe(99);
      expect(state.isRefreshBtnOn).toBe(false);
      expect(state.selectedStoreId).toBe(null);
    });
  });
});
