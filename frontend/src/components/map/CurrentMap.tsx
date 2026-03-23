import React, { useState } from "react";
import { IoLocateOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useToastStore from "@/stores/toastStore";
import useMapStore from "@/stores/mapStore";

interface GoToCurrentLocationButtonProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
}

function GoToCurrentLocationButton({ mapRef }: GoToCurrentLocationButtonProps) {
  const { addToast } = useToastStore();
  const search = useMapStore((s) => s.search);
  const setPosition = useMapStore((s) => s.setPosition);
  const [isLocating, setIsLocating] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) {
      addToast("이 브라우저에서는 위치 정보를 지원하지 않습니다.", "error");
      return;
    }
    if (isLocating) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const map = mapRef.current;
        if (map && window.kakao && window.kakao.maps) {
          map.setCenter(new window.kakao.maps.LatLng(lat, lng));
        }
        const offset = 0.045;
        setPosition({ lat, lng });
        search(
          { swLat: lat - offset, swLng: lng - offset, neLat: lat + offset, neLng: lng + offset },
          true
        );
        setIsLocating(false);
      },
      () => {
        addToast("현재 위치를 가져올 수 없습니다.", "error");
        setIsLocating(false);
      }
    );
  };

  return (
    <button
      type="button"
      className="
        fixed bottom-8 right-4 z-20
        flex items-center gap-1.5 pl-3.5 pr-4 py-2.5 rounded-full
        bg-white/95 backdrop-blur-md border border-white/60
        shadow-lg
        text-[13px] font-semibold text-gray-700 tracking-tight
        hover:bg-primary5 hover:text-white hover:border-primary5 hover:shadow-xl
        active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:pointer-events-none
      "
      onClick={handleClick}
      disabled={isLocating}
      aria-label="현위치로 이동"
    >
      {isLocating ? (
        <AiOutlineLoading3Quarters className="text-primary5 text-sm animate-spin" />
      ) : (
        <IoLocateOutline className="text-primary5 text-sm" />
      )}
      내 위치
    </button>
  );
}

export default GoToCurrentLocationButton;
