import { searchNearby, type SearchNearbyProps } from "@/api/map.api";
import useMapStore from "@/stores/mapStore";
import useToastStore from "@/stores/toastStore";

export const useMap = () => {
  const { setRestaurants } = useMapStore();
  const { addToast } = useToastStore();

  const fetchRestaurants = async (data: SearchNearbyProps) => {
    try {
      const res = await searchNearby(data);
      setRestaurants(res.data);
    } catch (error) {
      addToast("데이터를 불러오는데 실패했습니다.", "error");
    }
  };

  return {
    fetchRestaurants,
  };
};
