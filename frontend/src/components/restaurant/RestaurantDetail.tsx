import { useState, useEffect } from "react";
import type { RestaurantDetail } from "@/types/restaurant.types";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import useAuthStore from "@/stores/authStore";
import { getStoreDetail } from "@/api/restaurant.api";
import RestaurantDetailHeader from "./RestaurantDetailHeader";
import RestaurantDetailImageSection from "./RestaurantDetailImageSection";
import RestaurantDetailTabs from "./RestaurantDetailTabs";
import RestaurantDetailHomeTab from "./RestaurantDetailHomeTab";
import RestaurantDetailMenuTab from "./RestaurantDetailMenuTab";
import RestaurantDetailBroadcastTab from "./RestaurantDetailBroadcastTab";
import RestaurantDetailPhotoTab from "./RestaurantDetailPhotoTab";
import useMapStore from "@/stores/mapStore";
import { searchNearby } from "@/api/map.api";
import { SEARCHNEARBY_RADIUS } from "@/constants/map-constant";

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
  const [detail, setDetail] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setPosition, setRestaurants, setRefreshBtn } = useMapStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { isFavorite, toggleFavorite } = useFavoriteToggle(storeId);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getStoreDetail(storeId)
      .then(async (res) => {
        if (res.success && res.data) {
          setDetail(res.data);
          setPosition({ lat: res.data.lat, lng: res.data.lng });
          const nearStores = await searchNearby({
            lat: res.data.lat,
            lng: res.data.lng,
            radius: SEARCHNEARBY_RADIUS,
          });
          setRestaurants(nearStores.data);
          setRefreshBtn(false);
        } else {
          setError("상세 정보를 찾을 수 없습니다.");
        }
      })
      .catch(() => setError("상세 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [storeId, isLoggedIn, setPosition, setRestaurants, setRefreshBtn]);



  if (loading) {
    return (
      <aside className="fixed left-0 top-0 h-full w-[430px] z-[100] bg-white shadow-2xl border-r border-gray-100 flex flex-col font-pretendard">
        <div className="flex-1 flex items-center justify-center">
          로딩 중...
        </div>
      </aside>
    );
  }

  if (error || !detail) {
    return (
      <aside className="fixed left-0 top-0 h-full w-[430px] z-[100] bg-white shadow-2xl border-r border-gray-100 flex flex-col font-pretendard">
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error || "오류"}
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[430px] z-[100] bg-white shadow-2xl border-r border-gray-100 flex flex-col font-pretendard">
      <RestaurantDetailHeader />
      <RestaurantDetailImageSection
        detail={detail}
        isFavorite={isFavorite}
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
