import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiStar, FiImage, FiShare2 } from "react-icons/fi";
import type { RestaurantDetail } from "@/types/restaurant.types";
import useToastStore from "@/stores/toastStore";

interface RestaurantDetailImageSectionProps {
  storeId: number;
  detail: RestaurantDetail;
  isFavorite: boolean;
  isFavoritePending?: boolean;
  onToggleFavorite: () => void;
}

const ShareButton = ({ storeId, detail }: { storeId: number; detail: RestaurantDetail }) => {
  const addToast = useToastStore((s) => s.addToast);

  const getShareUrl = () => `${window.location.origin}/map?store=${storeId}`;

  const handleShare = () => {
    const kakao = window.Kakao;

    // SDK 로드 안 됐으면 링크 복사로 대체
    if (!kakao) {
      copyLink();
      return;
    }

    // lazy init
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT);
    }

    const url = getShareUrl();
    try {
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: detail.store_name,
          description: detail.address,
          imageUrl: detail.img_urls?.[0] || `${window.location.origin}/og-image.png`,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          {
            title: "Playce에서 보기",
            link: { mobileWebUrl: url, webUrl: url },
          },
        ],
      });
    } catch {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getShareUrl())
      .then(() => addToast("링크가 복사되었습니다.", "success"))
      .catch(() => addToast("링크 복사에 실패했습니다.", "error"));
  };

  return (
    <button
      onClick={handleShare}
      className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md
        hover:bg-white hover:scale-110 transition-all"
      aria-label="공유하기"
    >
      <FiShare2 className="text-gray-500 text-lg" />
    </button>
  );
};

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

const NoImagePlaceholder = ({
  storeId,
  detail,
  isFavorite,
  isFavoritePending = false,
  onToggleFavorite,
}: RestaurantDetailImageSectionProps) => (
  <div className="w-full h-52 bg-gray-100 relative overflow-hidden flex items-center justify-center">
    <FiImage className="text-5xl text-gray-300" />

    <div className="absolute left-4 top-4 z-10 flex gap-2">
      <FavoriteButton
        isFavorite={isFavorite}
        isFavoritePending={isFavoritePending}
        onToggleFavorite={onToggleFavorite}
      />
      <ShareButton storeId={storeId} detail={detail} />
    </div>

    <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
      {detail.type && (
        <span className="text-[11px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">
          {detail.type}
        </span>
      )}
      <h2 className="text-xl font-bold text-gray-600 mt-1">
        {detail.store_name}
      </h2>
    </div>
  </div>
);

const RestaurantDetailImageSection = (props: RestaurantDetailImageSectionProps) => {
  const { detail, isFavorite, isFavoritePending = false, onToggleFavorite } = props;
  const imgUrl = detail.img_urls?.[0];

  // 이미지 없으면 바로 텍스트 레이아웃
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!imgUrl || imgError) {
    return <NoImagePlaceholder {...props} />;
  }

  return (
    <>
      {/* 이미지 로드 전에는 텍스트 헤더를 보여줌 */}
      {!imgLoaded && <NoImagePlaceholder {...props} />}

      {/* 이미지 (로드 전에는 숨김, 로드 성공하면 표시) */}
      <div className={`w-full h-52 bg-gray-100 relative overflow-hidden ${!imgLoaded ? "hidden" : ""}`}>
        <img
          src={imgUrl}
          alt={detail.store_name}
          className="w-full h-full object-cover"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        <div className="absolute left-4 top-4 z-10 flex gap-2">
          <FavoriteButton
            isFavorite={isFavorite}
            isFavoritePending={isFavoritePending ?? false}
            onToggleFavorite={onToggleFavorite}
          />
          <ShareButton storeId={props.storeId} detail={detail} />
        </div>

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
    </>
  );
};

export default RestaurantDetailImageSection;
