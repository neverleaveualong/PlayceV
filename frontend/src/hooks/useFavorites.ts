import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "@/api/favorite.api";
import type { RestaurantBasic } from "@/types/restaurant.types";
import useAuthStore from "@/stores/authStore";
import useToastStore from "@/stores/toastStore";

export const useFavorites = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery<RestaurantBasic[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await getFavorites();
      return res.data.stores ?? [];
    },
    enabled: isLoggedIn,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  return useMutation({
    mutationFn: (storeId: number) => addFavorite(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      addToast("즐겨찾기 추가에 실패했습니다", "error");
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  return useMutation({
    mutationFn: (storeId: number) => removeFavorite(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      addToast("즐겨찾기 삭제에 실패했습니다", "error");
    },
  });
};
