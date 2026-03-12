import { useQuery } from "@tanstack/react-query";
import { searchNearby } from "@/api/map.api";
import type { RestaurantBasic } from "@/types/restaurant.types";

const useNearbyRestaurants = (
  lat: number,
  lng: number,
  radius: number,
  enabled = true
) => {
  return useQuery<RestaurantBasic[]>({
    queryKey: ["nearbyRestaurants", lat, lng, radius],
    queryFn: async () => {
      const res = await searchNearby({ lat, lng, radius });
      return res.data;
    },
    enabled,
  });
};

export default useNearbyRestaurants;
