import { useState, useEffect } from "react";
import useMapStore from "@/stores/mapStore";
import { CITY_STATION } from "@/constants/mapConstant";

export const useGeoLocation = (options = {}) => {
  const { initPosition } = useMapStore();

  const [error, setError] = useState("");

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;

    initPosition({
      lat: latitude,
      lng: longitude,
    });
  };

  const handleError = (err: GeolocationPositionError) => {
    setError(err.message);

    initPosition(CITY_STATION);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("위치 기능을 지원하지 않습니다");

      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { error };
};
