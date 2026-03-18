import { FiChevronLeft } from "react-icons/fi";
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
    <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100">
      <button
        className="text-2xl font-bold tracking-tight text-primary5 font-pretendard focus:outline-none"
        onClick={() => {
          resetSearch();
          resetRegions();
          resetSport();
          window.scrollTo(0, 0);
        }}
        aria-label="홈으로 이동"
      >
        Playce
      </button>
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        aria-label="사이드바 닫기"
      >
        <FiChevronLeft className="text-lg" />
      </button>
    </div>
  );
}
