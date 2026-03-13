import Button from "@/components/common/Button";
import useMapStore from "@/stores/mapStore";
import { IoReloadOutline } from "react-icons/io5";

function getScaledValue(level: number): number {
  if (level >= 8) {
    return 20;
  } else if (level === 7) {
    return 10;
  } else {
    return 5;
  }
}

const SpotRefreshButton = () => {
  const { zoomLevel, search } = useMapStore();

  return (
    <Button
      icon={<IoReloadOutline />}
      size="medium"
      className={`
    absolute top-[80px] left-1/2 -translate-x-1/2 z-10 rounded-lg
    bg-primary5 border border-primary5 text-white
    hover:bg-white hover:text-primary5 hover:border-primary5
    transition-colors
  `}
      onClick={() => {
        search(getScaledValue(zoomLevel));
      }}
    >
      이 위치에서 재탐색
    </Button>
  );
};

export default SpotRefreshButton;
