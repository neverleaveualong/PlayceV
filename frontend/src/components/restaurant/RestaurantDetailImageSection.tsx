import { FaStar } from "react-icons/fa";
import { FiStar, FiX } from "react-icons/fi";
import type { RestaurantDetail } from "@/types/restaurant.types";

interface RestaurantDetailImageSectionProps {
  detail: RestaurantDetail;
  isFavorite: boolean;
  isFavoritePending?: boolean;
  onToggleFavorite: () => void;
  onClose?: () => void;
}

const RestaurantDetailImageSection = ({
  detail,
  isFavorite,
  isFavoritePending = false,
  onToggleFavorite,
  onClose,
}: RestaurantDetailImageSectionProps) => (
  <div className="w-full h-56 bg-gray-100 flex items-center justify-center relative">
    <img
      src={detail.img_urls?.[0] || "/noimg.png"}
      alt={detail.store_name}
      className="w-full h-full object-cover rounded-b-xl"
    />
    {/* 저장/공유 버튼 */}
    <div className="absolute left-6 top-6 flex gap-3 z-10">
      <button
        onClick={onToggleFavorite}
        disabled={isFavoritePending}
        className={`bg-white/90 rounded-full p-2 shadow hover:bg-primary4 transition ${isFavoritePending ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      >
        {isFavorite ? (
          <FaStar className="text-yellow-400 text-lg" />
        ) : (
          <FiStar className="text-primary5 text-lg" />
        )}
      </button>
    </div>
    {/* 닫기(X) 버튼 */}
    {onClose && (
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-white/90 rounded-full p-2 shadow hover:bg-primary4 transition z-20"
        aria-label="상세보기 닫기"
      >
        <FiX className="text-primary5 text-lg" />
      </button>
    )}
  </div>
);

export default RestaurantDetailImageSection;
