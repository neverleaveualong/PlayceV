import { FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import type { RestaurantDetail } from "@/types/restaurant.types";

interface RestaurantDetailImageSectionProps {
  detail: RestaurantDetail;
  isFavorite: boolean;
  isFavoritePending?: boolean;
  onToggleFavorite: () => void;
}

const FavoriteButton = ({
  isFavorite,
  isFavoritePending,
  onToggleFavorite,
  className,
}: {
  isFavorite: boolean;
  isFavoritePending: boolean;
  onToggleFavorite: () => void;
  className?: string;
}) => (
  <button
    onClick={onToggleFavorite}
    disabled={isFavoritePending}
    className={`bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md
      hover:bg-white hover:scale-110 transition-all
      ${isFavoritePending ? "opacity-50 cursor-not-allowed" : ""} ${className ?? ""}`}
    aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
  >
    {isFavorite ? (
      <FaStar className="text-yellow-400 text-lg" />
    ) : (
      <FiStar className="text-gray-500 text-lg" />
    )}
  </button>
);

const RestaurantDetailImageSection = ({
  detail,
  isFavorite,
  isFavoritePending = false,
  onToggleFavorite,
}: RestaurantDetailImageSectionProps) => {
  const hasImage = detail.img_urls && detail.img_urls.length > 0;

  if (!hasImage) {
    return (
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div>
          {detail.type && (
            <span className="text-[11px] bg-primary4 text-primary5 px-2 py-0.5 rounded-full font-medium">
              {detail.type}
            </span>
          )}
          <h2 className="text-xl font-bold text-gray-900 mt-1">{detail.store_name}</h2>
        </div>
        <FavoriteButton
          isFavorite={isFavorite}
          isFavoritePending={isFavoritePending}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-52 bg-gray-100 relative overflow-hidden">
      <img
        src={detail.img_urls[0]}
        alt={detail.store_name}
        className="w-full h-full object-cover"
      />

      {/* 하단 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

      {/* 즐겨찾기 버튼 */}
      <FavoriteButton
        isFavorite={isFavorite}
        isFavoritePending={isFavoritePending}
        onToggleFavorite={onToggleFavorite}
        className="absolute left-4 top-4 z-10"
      />

      {/* 가게명 + 카테고리 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
        {detail.type && (
          <span className="text-[11px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-medium">
            {detail.type}
          </span>
        )}
        <h2 className="text-xl font-bold text-white drop-shadow-md mt-1">
          {detail.store_name}
        </h2>
      </div>
    </div>
  );
};

export default RestaurantDetailImageSection;
