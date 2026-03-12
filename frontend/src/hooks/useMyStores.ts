import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { myStores, deleteStore } from "@/api/restaurant.api";
import type { MyStore } from "@/types/restaurant.types";

export const useMyStores = () => {
  return useQuery<MyStore[]>({
    queryKey: ["myStores"],
    queryFn: async () => {
      const res = await myStores();
      return res.data;
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storeId: number) => deleteStore(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStores"] });
    },
  });
};
