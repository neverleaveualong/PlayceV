import { useState, useEffect } from "react";
import useMapStore from "@/stores/mapStore";
import useToastStore from "@/stores/toastStore";
import { CITY_STATION } from "@/constants/mapConstant";

export const useGeoLocation = (options = {}) => {
  const { initPosition } = useMapStore();
  const { addToast } = useToastStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("위치 기능을 지원하지 않습니다");
      addToast("이 브라우저에서는 위치 기능을 지원하지 않습니다.", "error");
      initPosition(CITY_STATION);
      return;
    }

    addToast("현재 위치를 찾고 있어요...", "info");

    geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        initPosition({ lat: latitude, lng: longitude });
        addToast("현재 위치로 이동했어요!", "success");
      },
      (err) => {
        setError(err.message);
        initPosition(CITY_STATION);

        if (err.code === err.PERMISSION_DENIED) {
          addToast("위치 권한이 거부되었습니다. 기본 위치(서울)로 표시합니다.", "info");
        } else if (err.code === err.TIMEOUT) {
          addToast("위치를 가져오는 데 시간이 초과되었습니다.", "info");
        } else {
          addToast("위치를 가져올 수 없어 기본 위치로 표시합니다.", "info");
        }
      },
      options
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { error };
};
