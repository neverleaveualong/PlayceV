import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { FiTv } from "react-icons/fi";
import useMapStore from "@/stores/mapStore";
import RestaurantDetailComponent from "@/components/restaurant/RestaurantDetail";
import useRestaurantDetail from "@/hooks/useRestaurantDetail";
import useNearbyRestaurants from "@/hooks/useNearbyRestaurants";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyMessage from "@/components/restaurant/EmptyMessage";
import type { Broadcast } from "@/types/restaurant.types";
import { formatTimeShort } from "@/utils/formatTime";
import { getToday } from "@/utils/dateUtils";

const TodayBroadcastSidebar = memo(function TodayBroadcastSidebar() {
  const searchPosition = useMapStore((state) => state.searchPosition);
  const radius = useMapStore((state) => state.radius);
  const { data: restaurants = [], isLoading } = useNearbyRestaurants(
    searchPosition.lat,
    searchPosition.lng,
    radius
  );
  const { selectedStoreId, openDetail, closeDetail } = useRestaurantDetail();
  const { dateString: today } = getToday();

  type TodayBroadcast = Broadcast & {
    store_name: string;
    store_id: number;
    main_img: string | null;
    address: string;
    type: string;
  };

  const todayBroadcasts = useMemo(() => {
    const result: TodayBroadcast[] = [];
    restaurants.forEach((store) => {
      (store.broadcasts || []).forEach((b) => {
        if (b.match_date === today) {
          result.push({
            ...b,
            store_name: store.store_name,
            store_id: store.store_id,
            main_img: store.main_img,
            address: store.address,
            type: store.type,
          });
        }
      });
    });
    return result;
  }, [restaurants, today]);

  const SPORTS = useMemo(
    () => Array.from(new Set(todayBroadcasts.map((b) => b.sport))),
    [todayBroadcasts]
  );
  const [selectedSport, setSelectedSport] = useState<string>("");

  useEffect(() => {
    if (!SPORTS.includes(selectedSport)) {
      if (SPORTS.length > 0) setSelectedSport(SPORTS[0]);
      else setSelectedSport("");
    }
  }, [SPORTS, selectedSport]);

  const filtered = useMemo(
    () => todayBroadcasts.filter((b) => b.sport === selectedSport),
    [todayBroadcasts, selectedSport]
  );

  const handleOpenDetail = useCallback(
    (storeId: number) => {
      openDetail(storeId);
    },
    [openDetail]
  );

  return (
    <section className="w-full bg-white px-4 py-4 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        <FiTv className="text-primary1 text-xl" />
        <span className="text-lg font-bold">오늘의 중계일정</span>
      </div>
      <div className="text-sm text-gray-500 mb-4 font-medium tracking-tight">
        지도에서 탐색한 가게의 중계일정만 보여드려요
      </div>

      {isLoading ? (
        <LoadingSpinner message="중계 일정을 불러오는 중..." />
      ) : todayBroadcasts.length === 0 ? (
        <EmptyMessage message="오늘 중계되는 경기가 없습니다." />
      ) : (
        <>
          {/* 종목 탭 */}
          <nav className="flex gap-2 mb-4 border-b border-gray-100 pb-1">
            {SPORTS.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 pb-1 text-sm font-semibold rounded-t-lg border-b-2 ${
                  selectedSport === sport
                    ? "border-primary5 text-primary5 bg-primary4"
                    : "border-transparent text-gray-400 hover:text-primary5 hover:bg-primary3/50"
                } transition-colors`}
                style={{ background: "none" }}
              >
                {sport}
              </button>
            ))}
          </nav>
          {/* 카드형 경기 리스트 */}
          <ul>
            {filtered.length === 0 ? (
              <EmptyMessage message="오늘 중계되는 경기가 없습니다." />
            ) : (
              filtered.map((game) => (
                <li
                  key={`${game.store_id}-${game.match_time}-${game.league}`}
                  className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-3 flex items-center gap-4 cursor-pointer hover:bg-primary3/30 transition-colors"
                  onClick={() => handleOpenDetail(game.store_id)}
                >
                  <img
                    src={game.main_img || "/noimg.png"}
                    alt={game.store_name}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-primary5 truncate">
                        {game.store_name}
                      </span>
                      <span className="text-xs bg-primary4 text-primary5 rounded px-2 py-0.5 ml-2">
                        {game.league}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {game.team_one && game.team_two ? (
                        <>
                          <span className="font-semibold text-gray-800">
                            {game.team_one}
                          </span>
                          <span className="mx-1 text-xs text-gray-400">vs</span>
                          <span className="font-semibold text-gray-800">
                            {game.team_two}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                      <span className="ml-auto text-xs text-gray-500">
                        {formatTimeShort(game.match_time)}
                      </span>
                    </div>
                    {game.etc && (
                      <div className="mt-1 text-xs text-primary5">
                        {game.etc}
                      </div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
          <div className="h-8" />
        </>
      )}

      {selectedStoreId && (
        <RestaurantDetailComponent
          storeId={selectedStoreId}
          onClose={closeDetail}
        />
      )}
    </section>
  );
});

export default TodayBroadcastSidebar;
