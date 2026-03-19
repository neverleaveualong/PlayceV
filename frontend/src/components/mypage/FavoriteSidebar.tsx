import { useCallback, useState } from "react";
import useAuthStore from "@/stores/authStore";
import useMapStore from "@/stores/mapStore";
import { useFavorites, useRemoveFavorite, useUpcomingBroadcasts } from "@/hooks/useFavorites";
import type { UpcomingBroadcast } from "@/hooks/useFavorites";
import { FiStar, FiTrash2, FiMapPin, FiTv, FiClock, FiChevronRight } from "react-icons/fi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";
import FallbackImage from "@/components/common/FallbackImage";

export default function FavoriteSidebar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoginModalOpen = useAuthStore((state) => state.setIsLoginModalOpen);
  const { data: favorites = [], isLoading } = useFavorites();
  const { data: upcoming = [] } = useUpcomingBroadcasts();
  const removeMutation = useRemoveFavorite();
  const openDetail = useMapStore((state) => state.openDetail);
  const [showUpcoming, setShowUpcoming] = useState(true);

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    if (d.getTime() === today.getTime()) return "오늘";
    if (d.getTime() === tomorrow.getTime()) return "내일";
    return `${d.getMonth() + 1}/${d.getDate()}(${dayNames[d.getDay()]})`;
  };

  // 날짜별 그룹핑
  const groupedUpcoming = upcoming.reduce<Record<string, UpcomingBroadcast[]>>((acc, b) => {
    if (!acc[b.match_date]) acc[b.match_date] = [];
    acc[b.match_date].push(b);
    return acc;
  }, {});

  return (
    <section className="w-full">
      {/* 다가오는 중계 */}
      {upcoming.length > 0 && (
        <div className="px-4 pt-3 pb-2">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="flex items-center gap-2 w-full mb-2"
          >
            <FiTv className="text-primary5 text-sm" />
            <span className="text-sm font-bold text-gray-800">다가오는 중계</span>
            <span className="text-[10px] bg-primary4/60 text-primary5 rounded-full px-2 py-0.5 font-semibold">
              {upcoming.length}
            </span>
            <FiChevronRight
              className={`ml-auto text-gray-400 text-xs transition-transform ${showUpcoming ? "rotate-90" : ""}`}
            />
          </button>
          {showUpcoming && (
            <div className="space-y-3">
              {Object.entries(groupedUpcoming).map(([date, broadcasts]) => (
                <div key={date}>
                  <div className="text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">
                    {formatDate(date)}
                  </div>
                  <ul className="space-y-1.5">
                    {broadcasts.map((b) => (
                      <li
                        key={b.broadcast_id}
                        onClick={() => openDetail(b.store.store_id, "중계")}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-primary4/30 cursor-pointer transition-colors"
                      >
                        <FallbackImage
                          src={b.store.main_img || "/noimg.png"}
                          alt={b.store.store_name}
                          className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-gray-200 text-gray-600 rounded px-1.5 py-0.5 font-medium flex-shrink-0">
                              {b.league}
                            </span>
                            {b.team_one && b.team_two ? (
                              <span className="text-[12px] text-gray-700 truncate">
                                {b.team_one} vs {b.team_two}
                              </span>
                            ) : (
                              <span className="text-[12px] text-gray-500">{b.sport}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                              <FiClock className="text-[9px]" />
                              {b.match_time}
                            </span>
                            <span className="text-[11px] text-gray-400 truncate">
                              {b.store.store_name}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className="border-b border-gray-100 mt-3" />
        </div>
      )}

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
