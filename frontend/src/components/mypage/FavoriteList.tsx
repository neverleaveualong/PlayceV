import RestaurantCardList from "@/components/restaurant/RestaurantCardList";
import RestaurantDetailComponent from "@/components/restaurant/RestaurantDetail";
import SectionHeader from "@/components/common/SectionHeader";
import useRestaurantDetail from "@/hooks/useRestaurantDetail";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";

interface FavoriteListProps {
  onClose: () => void;
}

const FavoriteList = ({ onClose }: FavoriteListProps) => {
  const { data: favorites = [] } = useFavorites();
  const removeMutation = useRemoveFavorite();
  const { selectedStoreId, openDetail, closeDetail } = useRestaurantDetail();

  // 상세보기 버튼 클릭 시 storeId만 저장
  const handleDetail = (store_id: number) => {
    openDetail(store_id);
  };

  return (
    <section className="px-2">
      <SectionHeader title="즐겨찾기" onClose={onClose} />
      <RestaurantCardList
        stores={favorites}
        onRemove={(storeId) => removeMutation.mutate(storeId)}
        showDelete
        showDetail
        compact={false}
        onDetail={handleDetail}
      />
      {/* 상세보기 모달/사이드바 */}
      {selectedStoreId !== null && (
        <RestaurantDetailComponent
          storeId={selectedStoreId}
          onClose={closeDetail}
        />
      )}
    </section>
  );
};

export default FavoriteList;
