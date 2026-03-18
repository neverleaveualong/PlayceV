import { FaStar } from "react-icons/fa";
import { FiStar, FiImage } from "react-icons/fi";
import type { RestaurantDetail } from "@/types/restaurant.types";

interface RestaurantDetailImageSectionProps {
  detail: RestaurantDetail;
  isFavorite: boolean;
  isFavoritePending?: boolean;
  onToggleFavorite: () => void;
}

const RestaurantDetailImageSection = ({
  detail,
  isFavorite,
  isFavoritePending = false,
  onToggleFavorite,
}: RestaurantDetailImageSectionProps) => {
  const hasImage = detail.img_urls && detail.img_urls.length > 0;

  return (
    <div className="w-full h-56 bg-gray-100 relative overflow-hidden">
      {hasImage ? (
        <img
          src={detail.img_urls[0]}
          alt={detail.store_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
          <FiImage className="text-4xl" />
          <span className="text-sm">등록된 사진이 없습니다</span>
        </div>
      )}

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* 즐겨찾기 버튼 */}
      <button
        onClick={onToggleFavorite}
        disabled={isFavoritePending}
        className={`absolute left-4 top-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md
          hover:bg-white hover:scale-110 transition-all z-10
          ${isFavoritePending ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      >
        {isFavorite ? (
          <FaStar className="text-yellow-400 text-lg" />
        ) : (
          <FiStar className="text-gray-600 text-lg" />
        )}
      </button>
    </div>
  );
};

export default RestaurantDetailImageSection;
