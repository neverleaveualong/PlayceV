import { useQuery } from "@tanstack/react-query";
import { getStoreDetail } from "@/api/restaurant.api";
import type { RestaurantDetail } from "@/types/restaurant.types";

const useStoreDetail = (storeId: number) => {
  return useQuery<RestaurantDetail>({
    queryKey: ["storeDetail", storeId],
    queryFn: async () => {
      const res = await getStoreDetail(storeId);
      return res.data;
    },
  });
};

export default useStoreDetail;
