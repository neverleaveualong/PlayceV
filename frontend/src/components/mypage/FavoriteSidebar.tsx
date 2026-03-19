import { useCallback } from "react";
import useAuthStore from "@/stores/authStore";
import useMapStore from "@/stores/mapStore";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";
import { FiStar, FiTrash2, FiMapPin } from "react-icons/fi";
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
      {/* 카드 리스트 */}
      <ul className="flex flex-col gap-2.5 px-4 pb-4 pt-3">
        {favorites.map((store) => (
          <li
            key={store.store_id}
            className="group relative flex gap-3.5 p-3 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:bg-primary4/30 cursor-pointer transition-all duration-150"
            onClick={() => openDetail(store.store_id)}
          >
            {/* 이미지 */}
            <FallbackImage
              src={store.main_img || "/noimg.png"}
              alt={store.store_name}
              className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
            />

            {/* 텍스트 */}
            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px] text-mainText truncate">
                  {store.store_name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary4/60 text-primary5 font-semibold flex-shrink-0 tracking-tight">
                  {store.type}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <FiMapPin className="text-[11px] text-gray-400 flex-shrink-0" />
                <p className="text-xs text-darkgray truncate">
                  {store.address}
                </p>
              </div>
            </div>

            {/* 삭제 — hover 시에만 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(store.store_id);
              }}
              className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200"
              aria-label="삭제"
            >
              <FiTrash2 className="text-gray-500 group-hover:text-gray-500 hover:!text-white text-[11px]" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
