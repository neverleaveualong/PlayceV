import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/useFavorites";
import useAuthStore from "@/stores/authStore";

const useFavoriteToggle = (storeId: number) => {
  const { data: favorites = [] } = useFavorites();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoginModalOpen = useAuthStore((state) => state.setIsLoginModalOpen);

  const addMutation = useAddFavorite();
  const removeMutation = useRemoveFavorite();

  const isFavorite = favorites.some((fav) => fav.store_id === storeId);
  const isPending = addMutation.isPending || removeMutation.isPending;

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
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
