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

  const pendingModalId = useMapStore((state) => state.pendingModalId);
  const setOpenedModal = useMapStore((state) => state.setOpenedModal);

  const addToast = useToastStore((state) => state.addToast);
  const { data: restaurants = [], isFetching } = useNearbyRestaurants(bounds);
  const isRefreshTriggered = useRef(false);
  const prevRefreshBtn = useRef(isRefreshBtnOn);
  const prevFetching = useRef(false);
  const restaurantsRef = useRef(restaurants);
  restaurantsRef.current = restaurants;

  // pendingModalId가 있고 해당 식당이 로드되면 모달 열기
  useEffect(() => {
    if (
      pendingModalId !== null &&
      restaurants.some((r) => r.store_id === pendingModalId)
    ) {
      setOpenedModal(pendingModalId);
      useMapStore.setState({ pendingModalId: null });
    }
  }, [pendingModalId, restaurants, setOpenedModal]);

  // 재탐색 버튼 클릭 감지: isRefreshBtnOn이 true → false로 바뀔 때
  useEffect(() => {
    if (prevRefreshBtn.current && !isRefreshBtnOn) {
      isRefreshTriggered.current = true;
    }
    prevRefreshBtn.current = isRefreshBtnOn;
  }, [isRefreshBtnOn]);

  // fetch 완료 감지: isFetching이 true → false로 바뀔 때
  useEffect(() => {
    if (prevFetching.current && !isFetching && isRefreshTriggered.current) {
      addToast(`주변 가게 ${restaurantsRef.current.length}곳을 찾았습니다`, "success");
      isRefreshTriggered.current = false;
    }
    prevFetching.current = isFetching;
  }, [isFetching, addToast]);

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

  // 윈도우 리사이즈 시 맵 크기 재조정
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => mapRef.current?.relayout(), 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCurPosition = () => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    return { lat: center.getLat(), lng: center.getLng() };
  };

  const handleDragEnd = useCallback(() => {
    setRefreshBtn(true);
    // 드래그하면 pendingModal 취소
    useMapStore.setState({ pendingModalId: null });
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
        {isRefreshBtnOn && (
          <SpotRefreshButton mapRef={mapRef} />
        )}
        <GoToCurrentLocationButton mapRef={mapRef} />
      </div>
    </>
  );
};

export default PlayceMap;
