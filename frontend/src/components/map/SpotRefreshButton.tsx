import useMapStore from "@/stores/mapStore";
import { IoReloadOutline } from "react-icons/io5";

function getScaledValue(level: number): number {
  if (level >= 8) return 20;
  if (level === 7) return 10;
  return 5;
}

const SpotRefreshButton = () => {
  const { zoomLevel, search } = useMapStore();

  return (
    <button
      className="
        absolute top-20 left-1/2 -translate-x-1/2 z-10
        flex items-center gap-1.5
        px-4 py-2 rounded-full
        bg-white/90 backdrop-blur-sm border border-gray-200
        shadow-lg
        text-sm font-medium text-gray-700
        hover:bg-white hover:border-primary5 hover:text-primary5 hover:shadow-xl
        transition-all
      "
      onClick={() => search(getScaledValue(zoomLevel))}
    >
      <IoReloadOutline className="text-base" />
      이 위치에서 재탐색
    </button>
  );
};

export default SpotRefreshButton;
