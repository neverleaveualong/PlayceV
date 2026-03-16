import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { myStores, deleteStore } from "@/api/restaurant.api";
import type { MyStore } from "@/types/restaurant.types";
import useAuthStore from "@/stores/authStore";
import useToastStore from "@/stores/toastStore";

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
  const { addToast } = useToastStore();
  return useMutation({
    mutationFn: (storeId: number) => deleteStore(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStores"] });
    },
    onError: () => {
      addToast("식당 삭제에 실패했습니다", "error");
    },
  });
};
