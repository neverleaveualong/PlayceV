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
        group fixed bottom-24 right-12 z-20
        p-4 rounded-full bg-primary5 text-white shadow-md border border-primary5
        hover:bg-white hover:border-primary5 hover:text-primary5 transition-colors
        disabled:opacity-60 disabled:cursor-not-allowed
      "
      onClick={handleClick}
      disabled={isLocating}
      aria-label="현위치로 이동"
    >
      {isLocating ? (
        <AiOutlineLoading3Quarters className="text-white group-hover:text-primary5 text-2xl animate-spin" />
      ) : (
        <IoLocateOutline className="text-white group-hover:text-primary5 text-2xl transition-colors" />
      )}
    </button>
  );
}

export default GoToCurrentLocationButton;
