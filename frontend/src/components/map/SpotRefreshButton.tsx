import Button from "@/components/common/Button";
import useMapStore from "@/stores/mapStore";
import { IoReloadOutline } from "react-icons/io5";
import type { Bounds } from "@/types/map";

interface SpotRefreshButtonProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
}

const SpotRefreshButton = ({ mapRef }: SpotRefreshButtonProps) => {
  const search = useMapStore((state) => state.search);

  const handleClick = () => {
    const map = mapRef.current;
    if (!map) return;

    const kakaoBounds = map.getBounds();
    const sw = kakaoBounds.getSouthWest();
    const ne = kakaoBounds.getNorthEast();

    const bounds: Bounds = {
      swLat: sw.getLat(),
      swLng: sw.getLng(),
      neLat: ne.getLat(),
      neLng: ne.getLng(),
    };

    search(bounds);
  };

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
      onClick={handleClick}
    >
      이 위치에서 재탐색
    </Button>
  );
};

export default SpotRefreshButton;
