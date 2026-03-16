import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/useFavorites";
import useAuthStore from "@/stores/authStore";
import useToastStore from "@/stores/toastStore";

const useFavoriteToggle = (storeId: number) => {
  const { data: favorites = [] } = useFavorites();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { addToast } = useToastStore();

  const addMutation = useAddFavorite();
  const removeMutation = useRemoveFavorite();

  const isFavorite = favorites.some((fav) => fav.store_id === storeId);
  const isPending = addMutation.isPending || removeMutation.isPending;

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      addToast("로그인 후 이용할 수 있는 기능입니다.", "info");
      return;
    }
    if (isPending) return;
    if (isFavorite) {
      removeMutation.mutate(storeId);
    } else {
      addMutation.mutate(storeId);
    }
  };

  return { isFavorite, toggleFavorite, isPending };
};

export default useFavoriteToggle;
