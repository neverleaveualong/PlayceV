import useFavoriteStore from "@/stores/favoriteStore";
import useAuthStore from "@/stores/authStore";
import useToastStore from "@/stores/toastStore";

const useFavoriteToggle = (storeId: number) => {
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { addToast } = useToastStore();
  const isFavorite = favorites.some((fav) => fav.store_id === storeId);

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      addToast("로그인 후 이용할 수 있는 기능입니다.", "info");
      return;
    }
    if (isFavorite) {
      await removeFavorite(storeId);
    } else {
      await addFavorite(storeId);
    }
  };

  return { isFavorite, toggleFavorite };
};

export default useFavoriteToggle;
