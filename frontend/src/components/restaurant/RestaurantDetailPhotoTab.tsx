import { useState, useCallback, memo } from "react";
import type { RestaurantDetail } from "@/types/restaurant.types";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import EmptyMessage from "./EmptyMessage";

const RestaurantDetailPhotoTab = memo(function RestaurantDetailPhotoTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  const images = detail.img_urls || [];
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (modalIndex === null) return;
      setModalIndex(modalIndex > 0 ? modalIndex - 1 : images.length - 1);
    },
    [modalIndex, images.length]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (modalIndex === null) return;
      setModalIndex(modalIndex < images.length - 1 ? modalIndex + 1 : 0);
    },
    [modalIndex, images.length]
  );

  if (images.length === 0) {
    return <EmptyMessage message="등록된 사진이 없습니다." />;
  }

  return (
    <div>
      <div className={images.length === 1 ? "" : "grid grid-cols-2 gap-2.5"}>
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`${detail.store_name} 사진 ${idx + 1}`}
            className={`w-full object-cover rounded-xl cursor-pointer transition-all hover:brightness-95
              ${images.length === 1 ? "h-56" : "h-40"}`}
            loading="lazy"
            onClick={() => setModalIndex(idx)}
          />
        ))}
      </div>

      {/* 전체화면 모달 */}
      {modalIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center"
          onClick={() => setModalIndex(null)}
        >
          {/* 닫기 */}
          <button
            onClick={() => setModalIndex(null)}
            className="absolute top-6 right-6 bg-white/90 rounded-full p-2 shadow
              hover:bg-white transition z-20"
            aria-label="닫기"
          >
            <FiX className="text-gray-700 text-lg" />
          </button>

          {/* 이전 */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg
                hover:bg-white transition z-20"
              aria-label="이전 사진"
            >
              <FiChevronLeft className="text-gray-700 text-xl" />
            </button>
          )}

          {/* 이미지 */}
          <img
            src={images[modalIndex]}
            alt={`${detail.store_name} 사진 ${modalIndex + 1}`}
            className="max-w-[85vw] max-h-[85vh] object-contain select-none rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 다음 */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg
                hover:bg-white transition z-20"
              aria-label="다음 사진"
            >
              <FiChevronRight className="text-gray-700 text-xl" />
            </button>
          )}

          {/* 인디케이터 */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm
              px-4 py-1.5 rounded-full">
              {modalIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default RestaurantDetailPhotoTab;
