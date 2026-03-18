import { useCallback } from "react";
import useAuthStore from "@/stores/authStore";
import useMapStore from "@/stores/mapStore";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";
import { FiStar, FiTrash2 } from "react-icons/fi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";
import FallbackImage from "@/components/common/FallbackImage";

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
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <FiStar className="text-primary5" />
          <span className="text-sm font-semibold text-mainText">내 즐겨찾기</span>
        </div>
        <span className="text-xs text-darkgray bg-gray-100 px-2 py-0.5 rounded-full">
          {favorites.length}개
        </span>
      </div>

      {/* 카드 리스트 */}
      <ul className="flex flex-col gap-2 px-3 pb-3">
        {favorites.map((store) => (
          <li
            key={store.store_id}
            className="group relative flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary1 cursor-pointer transition-all duration-150"
            onClick={() => openDetail(store.store_id)}
          >
            <FallbackImage
              src={store.main_img || "/noimg.png"}
              alt={store.store_name}
              className="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-mainText truncate">
                  {store.store_name}
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary4 text-primary5 font-medium flex-shrink-0">
                  {store.type}
                </span>
              </div>
              <p className="text-xs text-darkgray truncate mt-1">
                {store.address}
              </p>
            </div>
            {/* 삭제 — hover 시에만 표시 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(store.store_id);
              }}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:border-red-200 transition-all duration-150"
              aria-label="삭제"
            >
              <FiTrash2 className="text-gray-400 hover:text-red-500 text-xs transition-colors" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
