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

type Tab = "홈" | "중계" | "메뉴" | "사진";

interface RestaurantDetailComponentProps {
  storeId: number;
  onClose: () => void;
}

const ASIDE_BASE = "w-full md:w-sidebar h-screen bg-white border-r border-gray-100 flex flex-col font-pretendard";

export default function RestaurantDetailComponent({
  storeId,
  onClose,
}: RestaurantDetailComponentProps) {
  const detailInitialTab = useMapStore((s) => s.detailInitialTab);
  const [currentTab, setCurrentTab] = useState<Tab>(
    (detailInitialTab as Tab) || "홈"
  );
  const { data: detail, isLoading: loading, error } = useStoreDetail(storeId);
  const { isFavorite, toggleFavorite, isPending: isFavoritePending } = useFavoriteToggle(storeId);

  useEffect(() => {
    if (!detail) return;
    const { zoomLevel, bounds } = useMapStore.getState();
    const storeLat = detail.lat;
    const storeLng = detail.lng;

    // 줌 레벨에 따른 동적 offset (마커 모달이 잘리지 않게 중심을 위로)
    // 줌 레벨 1=가장 가까움, 14=가장 멀리
    const offsetMap: Record<number, number> = {
      1: 0.001, 2: 0.002, 3: 0.004, 4: 0.008,
      5: 0.015, 6: 0.03, 7: 0.06, 8: 0.12,
      9: 0.24, 10: 0.5, 11: 1, 12: 2, 13: 4, 14: 8,
    };
    const latOffset = offsetMap[zoomLevel] ?? 0.004;
    const pos = { lat: storeLat + latOffset, lng: storeLng };

    // 가게가 현재 bounds 안에 있는지 확인
    const isInBounds =
      storeLat >= bounds.swLat && storeLat <= bounds.neLat &&
      storeLng >= bounds.swLng && storeLng <= bounds.neLng;

    if (isInBounds) {
      // bounds 안에 있으면 position만 이동
      useMapStore.setState({
        position: pos,
        isRefreshBtnOn: false,
        pendingModalId: storeId,
      });
    } else {
      // bounds 밖이면 bounds도 갱신해서 마커 로드
      const boundsOffset = 0.045;
      useMapStore.setState({
        position: pos,
        bounds: {
          swLat: storeLat - boundsOffset,
          swLng: storeLng - boundsOffset,
          neLat: storeLat + boundsOffset,
          neLng: storeLng + boundsOffset,
        },
        isRefreshBtnOn: false,
        pendingModalId: storeId,
      });
    }
  }, [detail, storeId]);

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
        storeId={storeId}
        detail={detail}
        isFavorite={isFavorite}
        isFavoritePending={isFavoritePending}
        onToggleFavorite={toggleFavorite}
      />
      <RestaurantDetailTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <div className="flex-1 px-5 pt-5 pb-3 text-base overflow-y-auto">
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
