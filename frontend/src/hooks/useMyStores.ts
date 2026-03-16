import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { myStores, deleteStore } from "@/api/restaurant.api";
import type { MyStore } from "@/types/restaurant.types";
import useAuthStore from "@/stores/authStore";

export const useMyStores = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery<MyStore[]>({
    queryKey: ["myStores"],
    queryFn: async () => {
      const res = await myStores();
      return res.data;
    },
    enabled: isLoggedIn,
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
