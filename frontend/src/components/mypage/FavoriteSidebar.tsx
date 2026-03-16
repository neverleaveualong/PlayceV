import { useCallback } from "react";
import useAuthStore from "@/stores/authStore";
import RestaurantCardList from "@/components/restaurant/RestaurantCardList";
import RestaurantDetailComponent from "@/components/restaurant/RestaurantDetail";
import useRestaurantDetail from "@/hooks/useRestaurantDetail";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyMessage from "@/components/restaurant/EmptyMessage";

export default function FavoriteSidebar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoginModalOpen = useAuthStore((state) => state.setIsLoginModalOpen);
  const { data: favorites = [], isLoading } = useFavorites();
  const removeMutation = useRemoveFavorite();
  const { selectedStoreId, openDetail, closeDetail } = useRestaurantDetail();

  const handleRemove = useCallback(
    (storeId: number) => {
      removeMutation.mutate(storeId);
    },
    [removeMutation]
  );

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
        <div className="text-4xl">⭐</div>
        <p className="text-gray-600 font-semibold text-base">
          자주 찾는 식당을 저장해보세요
        </p>
        <p className="text-gray-400 text-sm text-center">
          로그인하면 즐겨찾기한 식당의
          <br />
          중계 일정을 빠르게 확인할 수 있어요
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="mt-2 px-6 py-2 bg-primary5 text-white rounded-lg font-semibold text-sm hover:brightness-95 transition"
        >
          로그인하고 시작하기
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="즐겨찾기를 불러오는 중..." />;
  }

  if (favorites.length === 0) {
    return (
      <div className="py-8">
        <EmptyMessage message="즐겨찾기한 식당이 없습니다." />
        <p className="text-center text-gray-400 text-sm mt-2">
          식당 상세에서 ⭐ 버튼을 눌러 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="px-4 py-3 text-sm text-gray-500">
        총 {favorites.length}개
      </div>
      <RestaurantCardList
        stores={favorites}
        onRemove={handleRemove}
        showDelete
        showDetail
        compact
        onDetail={openDetail}
      />
      {selectedStoreId !== null && (
        <RestaurantDetailComponent
          storeId={selectedStoreId}
          onClose={closeDetail}
        />
      )}
    </section>
  );
}
