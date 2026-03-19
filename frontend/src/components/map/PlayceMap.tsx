import { useCallback, useEffect, useRef } from "react";
import { Map } from "react-kakao-maps-sdk";
import useMapStore from "@/stores/mapStore";
import PlayceMapMarker from "./PlayceMapMarker";
import PlayceModal from "./PlayceModal";
import SpotRefreshButton from "./SpotRefreshButton";
import useToastStore from "@/stores/toastStore";
import GoToCurrentLocationButton from "./CurrentMap";
import useNearbyRestaurants from "@/hooks/useNearbyRestaurants";
import type { RestaurantBasic } from "@/types/restaurant.types";
import { CITY_STATION } from "@/constants/mapConstant";

const PlayceMap: React.FC = () => {
  const isSidebarOpen = useMapStore((state) => state.isSidebarOpen);
  const position = useMapStore((state) => state.position);
  const bounds = useMapStore((state) => state.bounds);
  const openedModal = useMapStore((state) => state.openedModal);
  const isRefreshBtnOn = useMapStore((state) => state.isRefreshBtnOn);
  const zoomLevel = useMapStore((state) => state.zoomLevel);
  const setPosition = useMapStore((state) => state.setPosition);
  const closeModal = useMapStore((state) => state.closeModal);
  const setRefreshBtn = useMapStore((state) => state.setRefreshBtn);
  const setZoomLevel = useMapStore((state) => state.setZoomLevel);
  const openDetail = useMapStore((state) => state.openDetail);

  const addToast = useToastStore((state) => state.addToast);
  const { data: restaurants = [], isFetching } = useNearbyRestaurants(bounds);
  const isRefreshTriggered = useRef(false);
  const prevFetchingRef = useRef(false);

  // 재탐색 버튼 클릭 시 isRefreshBtnOn이 false로 바뀜 → 트리거 감지
  useEffect(() => {
    if (!isRefreshBtnOn && prevFetchingRef.current) {
      isRefreshTriggered.current = true;
    }
  }, [isRefreshBtnOn]);

  useEffect(() => {
    if (prevFetchingRef.current && !isFetching && isRefreshTriggered.current) {
      addToast(`주변 가게 ${restaurants.length}곳을 찾았습니다`, "success");
      isRefreshTriggered.current = false;
    }
    prevFetchingRef.current = isFetching;
  }, [isFetching, restaurants.length, addToast]);

  const mapRef = useRef<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (typeof map.getLevel === "function") {
        map.setLevel(zoomLevel);
      }
    }
  }, [zoomLevel]);

  // 사이드바 토글 시 맵 크기 재조정
  useEffect(() => {
    if (!mapRef.current) return;
    const timer = setTimeout(() => {
      mapRef.current?.relayout();
    }, 310);
    return () => clearTimeout(timer);
  }, [isSidebarOpen]);

  const getCurPosition = () => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    return { lat: center.getLat(), lng: center.getLng() };
  };

  const handleDragEnd = useCallback(() => {
    setRefreshBtn(true);
    const pos = getCurPosition();
    if (!pos) {
      useToastStore.getState().addToast("위치 정보를 불러올 수 없습니다", "error");
      return;
    }
    setPosition(pos);
  }, [setRefreshBtn, setPosition]);

  const handleZoomChanged = useCallback(
    (map: kakao.maps.Map) => {
      const newZoomLevel = map.getLevel();
      setZoomLevel(newZoomLevel);
    },
    [setZoomLevel]
  );

  const handleDetailClick = (restaurant: RestaurantBasic) => {
    openDetail(restaurant.store_id);
  };

  return (
    <>
      <div className="relative w-full h-full">
        <Map
          className="w-full h-full"
          ref={mapRef}
          center={position ? position : CITY_STATION}
          isPanto={true}
          onClick={closeModal}
          onDragEnd={handleDragEnd}
          onZoomChanged={handleZoomChanged}
        >
          {restaurants.map((restaurant) => (
            <PlayceMapMarker
              key={restaurant.store_id}
              restaurant={restaurant}
            />
          ))}
          {openedModal !== -1 && (
            <PlayceModal
              restaurant={restaurants.find((r) => r.store_id === openedModal)!}
              onDetailClick={handleDetailClick}
              onClose={closeModal}
            />
          )}
        </Map>
        {isRefreshBtnOn && openedModal === -1 && (
          <SpotRefreshButton mapRef={mapRef} />
        )}
        <GoToCurrentLocationButton mapRef={mapRef} />
      </div>
    </>
  );
};

export default PlayceMap;
