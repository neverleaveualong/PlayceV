import useFavoriteStore from "@/stores/favoriteStore";
import useAuthStore from "@/stores/authStore";

const useFavoriteToggle = (storeId: number) => {
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isFavorite = favorites.some((fav) => fav.store_id === storeId);

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용할 수 있는 기능입니다.");
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
