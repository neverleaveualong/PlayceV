import { useCallback } from "react";
import useAuthStore from "@/stores/authStore";
import RestaurantCardList from "@/components/restaurant/RestaurantCardList";
import useMapStore from "@/stores/mapStore";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";
import { FiStar } from "react-icons/fi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";

export default function FavoriteSidebar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoginModalOpen = useAuthStore((state) => state.setIsLoginModalOpen);
  const { data: favorites = [], isLoading } = useFavorites();
  const removeMutation = useRemoveFavorite();
  const openDetail = useMapStore((state) => state.openDetail);

  const handleRemove = useCallback(
    (storeId: number) => {
      removeMutation.mutate(storeId);
    },
    [removeMutation]
  );

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 px-8">
        <div className="w-14 h-14 rounded-full bg-primary4 flex items-center justify-center">
          <FiStar className="text-primary5 text-2xl" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-base mb-2">
            자주 찾는 식당을 저장해보세요
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            로그인하면 즐겨찾기한 식당의
            <br />
            중계 일정을 빠르게 확인할 수 있어요
          </p>
        </div>
        <Button
          onClick={() => setIsLoginModalOpen(true)}
          scheme="primary"
          size="medium"
          className="rounded-full px-6"
        >
          로그인하고 시작하기
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="즐겨찾기를 불러오는 중..." />;
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 px-8">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <FiStar className="text-gray-400 text-xl" />
        </div>
        <p className="text-gray-500 text-sm text-center">
          즐겨찾기한 식당이 없습니다
        </p>
        <p className="text-gray-400 text-xs text-center">
          식당 상세에서 별 버튼을 눌러 추가해보세요
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
    </section>
  );
}
