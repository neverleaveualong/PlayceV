import { FiMapPin, FiX } from "react-icons/fi";
import { useSearchStore } from "@/stores/searchStore";
import { useRegionStore } from "@/stores/regionStore";
import { useSportStore } from "@/stores/sportStore";
import useMapStore from "@/stores/mapStore";

export default function AppLogoHeader() {
  const resetSearch = useSearchStore((state) => state.reset);
  const resetRegions = useRegionStore((state) => state.resetRegions);
  const resetSport = useSportStore((state) => state.resetSport);
  const toggleSidebar = useMapStore((state) => state.toggleSidebar);

  return (
    <div className="h-14 flex items-center justify-between px-5 border-b border-gray-100">
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => {
          resetSearch();
          resetRegions();
          resetSport();
        }}
        aria-label="홈으로 이동"
      >
        <FiMapPin className="text-primary5 text-xl" />
        <span className="text-xl font-bold tracking-tight text-primary5">
          Playce
        </span>
      </button>

      {/* 모바일 닫기 — AppHeader에 통합 */}
      <button
        onClick={toggleSidebar}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
        aria-label="닫기"
      >
        <FiX className="text-lg" />
      </button>
    </div>
  );
}
