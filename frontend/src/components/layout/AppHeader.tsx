import { FiMapPin } from "react-icons/fi";
import { useSearchStore } from "@/stores/searchStore";
import { useRegionStore } from "@/stores/regionStore";
import { useSportStore } from "@/stores/sportStore";

export default function AppLogoHeader() {
  const resetSearch = useSearchStore((state) => state.reset);
  const resetRegions = useRegionStore((state) => state.resetRegions);
  const resetSport = useSportStore((state) => state.resetSport);

  return (
    <div className="h-14 flex items-center px-5 border-b border-gray-100">
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => {
          resetSearch();
          resetRegions();
          resetSport();
          window.scrollTo(0, 0);
        }}
        aria-label="홈으로 이동"
      >
        <FiMapPin className="text-primary5 text-xl" />
        <span className="text-xl font-bold tracking-tight text-primary5">
          Playce
        </span>
      </button>
    </div>
  );
}
