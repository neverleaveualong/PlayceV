import { useState, useEffect } from "react";
import { FiMapPin, FiChevronUp } from "react-icons/fi";
import useMapStore from "@/stores/mapStore";
import { QUICK_CITIES, getCityBounds } from "@/constants/mapConstant";

const INITIAL_VISIBLE = 5;

const CityQuickNav = () => {
  const setPosition = useMapStore((s) => s.setPosition);
  const search = useMapStore((s) => s.search);
  const isRefreshBtnOn = useMapStore((s) => s.isRefreshBtnOn);
  const [expanded, setExpanded] = useState(false);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  // 맵 드래그 시 하이라이트 해제
  useEffect(() => {
    if (isRefreshBtnOn) setActiveCity(null);
  }, [isRefreshBtnOn]);

  const handleCity = (city: (typeof QUICK_CITIES)[number]) => {
    const pos = { lat: city.lat, lng: city.lng };
    const bounds = getCityBounds(city);
    setActiveCity(city.name);
    setPosition(pos);
    search(bounds, true);
    setExpanded(false);
  };

  const visibleCities = expanded
    ? QUICK_CITIES
    : QUICK_CITIES.slice(0, INITIAL_VISIBLE);

  return (
    <div className="fixed bottom-24 right-4 z-20 flex flex-col items-end gap-2">
      {/* 도시 목록 */}
      <div className="flex flex-col gap-1.5 items-end">
        {visibleCities.map((city) => {
          const isActive = activeCity === city.name;
          return (
            <button
              key={city.name}
              onClick={() => handleCity(city)}
              className={`
                flex items-center gap-1.5 pl-3 pr-3.5 py-2 rounded-full
                shadow-lg backdrop-blur-md border
                text-[13px] font-semibold tracking-tight
                active:scale-95 transition-all duration-200
                ${isActive
                  ? "bg-primary5 text-white border-primary5 shadow-primary5/30"
                  : "bg-white/95 text-gray-700 border-white/60 hover:bg-primary5 hover:text-white hover:border-primary5 hover:shadow-xl"
                }
              `}
            >
              <FiMapPin className={`text-[11px] ${isActive ? "text-white/80" : "text-primary5"}`} />
              {city.name}
            </button>
          );
        })}
      </div>

      {/* 더보기 / 접기 토글 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          flex items-center justify-center
          w-10 h-10 rounded-full
          bg-white/95 backdrop-blur-md border border-white/60
          shadow-lg
          hover:bg-gray-50 hover:shadow-xl
          active:scale-95 transition-all duration-200
        `}
        aria-label={expanded ? "도시 목록 접기" : "도시 더보기"}
      >
        <FiChevronUp
          className={`text-gray-500 text-base transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default CityQuickNav;
