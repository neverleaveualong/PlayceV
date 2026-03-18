import RestaurantCardList from "@/components/restaurant/RestaurantCardList";
import SectionHeader from "@/components/common/SectionHeader";
import useMapStore from "@/stores/mapStore";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";

interface FavoriteListProps {
  onClose: () => void;
}

const FavoriteList = ({ onClose }: FavoriteListProps) => {
  const { data: favorites = [] } = useFavorites();
  const removeMutation = useRemoveFavorite();
  const openDetail = useMapStore((state) => state.openDetail);

  return (
    <section className="px-2">
      <SectionHeader title="즐겨찾기" onClose={onClose} />
      <RestaurantCardList
        stores={favorites}
        onRemove={(storeId) => removeMutation.mutate(storeId)}
        showDelete
        showDetail
        compact={false}
        onDetail={(storeId) => openDetail(storeId)}
      />
    </section>
  );
};

export default FavoriteList;
