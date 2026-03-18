import React, { useState } from "react";
import { IoLocateOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useToastStore from "@/stores/toastStore";

interface GoToCurrentLocationButtonProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
}

function GoToCurrentLocationButton({ mapRef }: GoToCurrentLocationButtonProps) {
  const { addToast } = useToastStore();
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
        w-12 h-12 rounded-full
        bg-white/90 backdrop-blur-sm border border-gray-200
        shadow-lg
        flex items-center justify-center
        hover:bg-white hover:border-primary5 hover:shadow-xl
        transition-all
        disabled:opacity-50 disabled:pointer-events-none
      "
      onClick={handleClick}
      disabled={isLocating}
      aria-label="현위치로 이동"
    >
      {isLocating ? (
        <AiOutlineLoading3Quarters className="text-primary5 text-xl animate-spin" />
      ) : (
        <IoLocateOutline className="text-gray-600 text-xl" />
      )}
    </button>
  );
}

export default GoToCurrentLocationButton;
