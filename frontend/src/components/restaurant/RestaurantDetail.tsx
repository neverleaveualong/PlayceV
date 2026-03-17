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
  onClose?: () => void;
}

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
      <aside className="fixed left-0 top-0 h-full w-sidebar z-[100] bg-white shadow-2xl border-r border-gray-100 flex flex-col font-pretendard">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="식당 정보를 불러오는 중..." />
        </div>
      </aside>
    );
  }

  if (error || !detail) {
    return (
      <aside className="fixed left-0 top-0 h-full w-sidebar z-[100] bg-white shadow-2xl border-r border-gray-100 flex flex-col font-pretendard">
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error ? "상세 정보를 불러오지 못했습니다." : "오류"}
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-sidebar z-[100] bg-white shadow-2xl border-r border-gray-100 flex flex-col font-pretendard">
      <RestaurantDetailHeader />
      <RestaurantDetailImageSection
        detail={detail}
        isFavorite={isFavorite}
        isFavoritePending={isFavoritePending}
        onToggleFavorite={toggleFavorite}
        onClose={onClose}
      />
      <RestaurantDetailTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <div className="flex-1 p-6 text-base overflow-y-auto">
        {currentTab === "홈" && <RestaurantDetailHomeTab detail={detail} />}
        {currentTab === "메뉴" && <RestaurantDetailMenuTab detail={detail} />}
        {currentTab === "사진" && <RestaurantDetailPhotoTab detail={detail} />}
        {currentTab === "중계" && (
          <RestaurantDetailBroadcastTab
            detail={detail}
            storeId={storeId}
          />
        )}
      </div>
    </aside>
  );
}
