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
        px-5 py-2.5 rounded-full
        bg-primary5 border border-primary5
        shadow-lg
        text-sm font-semibold text-white
        hover:brightness-95 hover:shadow-xl
        transition-all animate-slide-up
      "
      onClick={() => search(getScaledValue(zoomLevel))}
    >
      <IoReloadOutline className="text-base" />
      이 위치에서 재탐색
    </button>
  );
};

export default SpotRefreshButton;
