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
    const { zoomLevel } = useMapStore.getState();
    const storeLat = detail.lat;
    const storeLng = detail.lng;

    // 줌 레벨에 따른 동적 offset (마커 모달이 잘리지 않게 중심을 약간 위로)
    // 기존 값이 너무 커서 가게가 화면 밖으로 밀리는 문제가 있었음
    const offsetMap: Record<number, number> = {
      1: 0.0004, 2: 0.0008, 3: 0.0015, 4: 0.003,
      5: 0.006, 6: 0.012, 7: 0.025, 8: 0.05,
      9: 0.1, 10: 0.2, 11: 0.4, 12: 0.8, 13: 1.6, 14: 3.2,
    };
    const latOffset = offsetMap[zoomLevel] ?? 0.0015;
    const pos = { lat: storeLat + latOffset, lng: storeLng };

    // 항상 bounds 갱신 + pendingModalId 사용
    // (드래그 시 bounds가 갱신되지 않아 isInBounds 판단이 부정확했던 문제 해결)
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
