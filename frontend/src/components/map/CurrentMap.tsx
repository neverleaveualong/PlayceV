import React from "react";
import { IoLocateOutline } from "react-icons/io5";
import useToastStore from "@/stores/toastStore";

interface GoToCurrentLocationButtonProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
}

function GoToCurrentLocationButton({ mapRef }: GoToCurrentLocationButtonProps) {
  const { addToast } = useToastStore();
  const handleClick = () => {
    if (!navigator.geolocation) {
      addToast("이 브라우저에서는 위치 정보를 지원하지 않습니다.", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const map = mapRef.current;
        if (map && window.kakao && window.kakao.maps) {
          map.setCenter(new window.kakao.maps.LatLng(lat, lng));
        }
      },
      () => {
        addToast("현재 위치를 가져올 수 없습니다.", "error");
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
  "
      onClick={handleClick}
      aria-label="현위치로 이동"
    >
      <IoLocateOutline className="text-white group-hover:text-primary5 text-2xl transition-colors" />
    </button>
  );
}

export default GoToCurrentLocationButton;
