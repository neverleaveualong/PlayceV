import { useQuery } from "@tanstack/react-query";
import { searchNearby } from "@/api/map.api";
import type { RestaurantBasic } from "@/types/restaurant.types";
import type { Bounds } from "@/types/map";

const useNearbyRestaurants = (bounds: Bounds, enabled = true) => {
  return useQuery<RestaurantBasic[]>({
    queryKey: ["nearbyRestaurants", bounds.swLat, bounds.swLng, bounds.neLat, bounds.neLng],
    queryFn: async () => {
      const res = await searchNearby(bounds);
      return res.data;
    },
    enabled,
    staleTime: 0,
  });
};

export default useNearbyRestaurants;
