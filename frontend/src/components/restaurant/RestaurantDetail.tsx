import { useState, useEffect } from "react";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import useStoreDetail from "@/hooks/useStoreDetail";
import RestaurantDetailHeader from "./RestaurantDetailHeader";
import RestaurantDetailImageSection from "./RestaurantDetailImageSection";
import RestaurantDetailTabs from "./RestaurantDetailTabs";
import RestaurantDetailHomeTab from "./RestaurantDetailHomeTab";
import RestaurantDetailMenuTab from "./RestaurantDetailMenuTab";
import RestaurantDetailBroadcastTab from "./RestaurantDetailBroadcastTab";
import RestaurantDetailPhotoTab from "./RestaurantDetailPhotoTab";
import useMapStore from "@/stores/mapStore";
import LoadingSpinner from "@/components/common/LoadingSpinner";

type Tab = "홈" | "메뉴" | "사진" | "중계";

interface RestaurantDetailComponentProps {
  storeId: number;
  onClose: () => void;
}

const ASIDE_BASE = "w-sidebar h-screen bg-white border-r border-gray-100 flex flex-col font-pretendard";

export default function RestaurantDetailComponent({
  storeId,
  onClose,
}: RestaurantDetailComponentProps) {
  const [currentTab, setCurrentTab] = useState<Tab>("홈");
  const { data: detail, isLoading: loading, error } = useStoreDetail(storeId);
  const { setPosition, setRefreshBtn } = useMapStore();
  const { isFavorite, toggleFavorite, isPending: isFavoritePending } = useFavoriteToggle(storeId);

  useEffect(() => {
    if (!detail) return;
    setPosition({ lat: detail.lat, lng: detail.lng });
    setRefreshBtn(false);
  }, [detail, setPosition, setRefreshBtn]);

  if (loading) {
    return (
      <aside className={ASIDE_BASE}>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="식당 정보를 불러오는 중..." />
        </div>
      </aside>
    );
  }

  if (error || !detail) {
    return (
      <aside className={ASIDE_BASE}>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
          <span className="text-lg">정보를 불러올 수 없습니다</span>
          <button
            onClick={onClose}
            className="text-sm text-primary5 hover:underline"
          >
            닫기
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={ASIDE_BASE}>
      <RestaurantDetailHeader onClose={onClose} />
      <RestaurantDetailImageSection
        detail={detail}
        isFavorite={isFavorite}
        isFavoritePending={isFavoritePending}
        onToggleFavorite={toggleFavorite}
      />
      <RestaurantDetailTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <div className="flex-1 p-5 text-base overflow-y-auto">
        {currentTab === "홈" && <RestaurantDetailHomeTab detail={detail} />}
        {currentTab === "메뉴" && <RestaurantDetailMenuTab detail={detail} />}
        {currentTab === "사진" && <RestaurantDetailPhotoTab detail={detail} />}
        {currentTab === "중계" && (
          <RestaurantDetailBroadcastTab detail={detail} storeId={storeId} />
        )}
      </div>
    </aside>
  );
}
