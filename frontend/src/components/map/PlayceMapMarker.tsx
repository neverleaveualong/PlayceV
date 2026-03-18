import { memo } from "react";
import { useMap, CustomOverlayMap } from "react-kakao-maps-sdk";
import useMapStore from "@/stores/mapStore";
import type { RestaurantBasic } from "@/types/restaurant.types";

interface PlayceMapMarkerProps {
  restaurant: RestaurantBasic;
}

const PlayceMapMarker = memo(function PlayceMapMarker({ restaurant }: PlayceMapMarkerProps) {
  const map = useMap();
  const { openedModal, setOpenedModal } = useMapStore();
  const isActive = openedModal === restaurant.store_id;
  const hasBroadcast = (restaurant.broadcasts?.length ?? 0) > 0;

  return (
    <CustomOverlayMap
      position={{ lat: restaurant.lat, lng: restaurant.lng }}
      yAnchor={1.3}
    >
      <button
        onClick={() => {
          // 모달이 상단에 뜨므로 pan 위치를 아래로 오프셋 (위도 기준 약간 위로)
          const projection = map.getProjection();
          const point = projection.pointFromCoords(
            new window.kakao.maps.LatLng(restaurant.lat, restaurant.lng)
          );
          point.y -= 120; // 모달 높이만큼 위로 올림
          const offsetLatLng = projection.coordsFromPoint(point);
          map.panTo(offsetLatLng);
          setOpenedModal(restaurant.store_id);
        }}
        className={`
          flex items-center gap-1 px-2.5 py-1.5 rounded-full
          shadow-md border transition-all cursor-pointer
          ${isActive
            ? "bg-primary5 text-white border-primary5 scale-110"
            : hasBroadcast
            ? "bg-white text-primary5 border-primary5 hover:bg-primary5 hover:text-white"
            : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
          }
        `}
        aria-label={`${restaurant.store_name} 상세보기`}
      >
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none">
          <path d="M6 0C3.24 0 1 2.24 1 5c0 4.5 5 7 5 7s5-2.5 5-7c0-2.76-2.24-5-5-5z" fill="currentColor" opacity="0.8"/>
          <circle cx="6" cy="5" r="2" fill="white"/>
        </svg>
        <span className="text-[11px] font-semibold truncate max-w-[80px]">
          {restaurant.store_name}
        </span>
        {hasBroadcast && (
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            isActive ? "bg-white" : "bg-red-400"
          } animate-pulse`} />
        )}
      </button>
    </CustomOverlayMap>
  );
});

export default PlayceMapMarker;
