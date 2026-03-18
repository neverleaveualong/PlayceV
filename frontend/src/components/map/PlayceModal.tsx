import { useEffect } from "react";
import type { RestaurantBasic } from "@/types/restaurant.types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { FiStar, FiMapPin, FiX, FiClock, FiTv } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Button from "@/components/common/Button";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";

const defaultImage = "/noimg.png";

interface PlayceModalProps {
  restaurant: RestaurantBasic | undefined;
  onDetailClick: (restaurant: RestaurantBasic) => void;
  onClose: () => void;
}

const PlayceModal = ({
  restaurant,
  onDetailClick,
  onClose,
}: PlayceModalProps) => {
  const { isFavorite, toggleFavorite, isPending: isFavoritePending } =
    useFavoriteToggle(restaurant?.store_id ?? 0);

  const isInvalid =
    !restaurant ||
    typeof restaurant.lat !== "number" ||
    typeof restaurant.lng !== "number";

  useEffect(() => {
    if (isInvalid) onClose?.();
  }, [isInvalid, onClose]);

  if (isInvalid) return null;

  const handleDetailClick = () => {
    onDetailClick(restaurant);
    onClose();
  };

  const upcomingBroadcast = restaurant.broadcasts?.length
    ? [...restaurant.broadcasts]
        .sort((a, b) => {
          const aDate = new Date(`${a.match_date}T${a.match_time}`);
          const bDate = new Date(`${b.match_date}T${b.match_time}`);
          return aDate.getTime() - bDate.getTime();
        })
        .find(
          (bc) => new Date(`${bc.match_date}T${bc.match_time}`) > new Date()
        )
    : null;

  return (
    <CustomOverlayMap
      position={{ lat: restaurant.lat, lng: restaurant.lng }}
      yAnchor={1.15}
    >
      <div className="relative w-[360px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden font-pretendard">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors"
          aria-label="닫기"
        >
          <FiX className="text-white text-sm" />
        </button>

        {/* 이미지 */}
        <div className="relative h-32 bg-gray-100">
          <img
            src={restaurant.main_img || defaultImage}
            alt={restaurant.store_name || "가게 이미지"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* 즐겨찾기 */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
            disabled={isFavoritePending}
            className={`absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all ${
              isFavoritePending ? "opacity-50" : "hover:scale-110"
            }`}
            aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            {isFavorite ? (
              <FaStar className="text-yellow-400 text-base" />
            ) : (
              <FiStar className="text-gray-400 text-base" />
            )}
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          {/* 가게 정보 */}
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {restaurant.store_name || "가게명 없음"}
                </h3>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-medium flex-shrink-0">
                  {restaurant.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <FiMapPin className="text-[11px] flex-shrink-0" />
                <span className="truncate">{restaurant.address || "주소 정보 없음"}</span>
              </div>
            </div>
          </div>

          {/* 중계 정보 */}
          {upcomingBroadcast ? (
            <div className="bg-primary4/40 rounded-xl px-3.5 py-3 mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <FiTv className="text-primary5 text-xs" />
                <span className="text-[11px] font-bold text-primary5">다음 중계</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600 font-medium">
                    {upcomingBroadcast.team_one && upcomingBroadcast.team_two ? (
                      <>
                        {upcomingBroadcast.team_one}
                        <span className="text-gray-400 mx-1">vs</span>
                        {upcomingBroadcast.team_two}
                      </>
                    ) : (
                      upcomingBroadcast.sport
                    )}
                  </span>
                  <span className="text-[10px] bg-white rounded-full px-1.5 py-0.5 text-gray-500">
                    {upcomingBroadcast.league}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <FiClock className="text-[10px]" />
                  {upcomingBroadcast.match_date} {upcomingBroadcast.match_time}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl px-3.5 py-3 mb-3 text-center">
              <p className="text-xs text-gray-400">예정된 중계 일정이 없습니다</p>
            </div>
          )}

          {/* 상세보기 버튼 */}
          <Button
            scheme="primary"
            fullWidth
            size="semi"
            className="rounded-xl"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleDetailClick}
          >
            상세보기
          </Button>
        </div>

        {/* 꼬리 */}
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
      </div>
    </CustomOverlayMap>
  );
};

export default PlayceModal;
