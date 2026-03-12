import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "@/api/favorite.api";
import type { RestaurantBasic } from "@/types/restaurant.types";
import useAuthStore from "@/stores/authStore";

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
  return useMutation({
    mutationFn: (storeId: number) => addFavorite(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storeId: number) => removeFavorite(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
