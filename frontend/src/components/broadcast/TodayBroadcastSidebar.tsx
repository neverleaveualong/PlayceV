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
import { getDistanceFromLatLon } from "@/utils/distanceUtils";

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
    lat: number;
    lng: number;
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
            lat: store.lat,
            lng: store.lng,
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

  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    todayBroadcasts.forEach((b) => {
      counts[b.sport] = (counts[b.sport] || 0) + 1;
    });
    return counts;
  }, [todayBroadcasts]);

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

  // LIVE / 다음 경기 판단
  const getMatchStatus = (matchTime: string) => {
    const now = new Date();
    const [h, m] = matchTime.split(":").map(Number);
    const matchStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000); // 약 2시간

    if (now >= matchStart && now <= matchEnd) return "live";
    if (matchStart > now) {
      const diffMin = Math.floor((matchStart.getTime() - now.getTime()) / 60000);
      if (diffMin <= 60) return `${diffMin}분 후`;
      return `${Math.floor(diffMin / 60)}시간 후`;
    }
    return "종료";
  };

  const todayDate = new Date();
  const formattedDate = `${todayDate.getFullYear()}.${String(todayDate.getMonth() + 1).padStart(2, "0")}.${String(todayDate.getDate()).padStart(2, "0")}`;
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[todayDate.getDay()];

  return (
    <section className="w-full bg-gray-50 rounded-xl p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <FiTv className="text-primary5" />
          <span className="text-sm font-semibold text-gray-800">오늘의 중계</span>
          {todayBroadcasts.length > 0 && (
            <span className="text-xs text-primary5 font-bold">{todayBroadcasts.length}경기</span>
          )}
        </div>
        <span className="text-[11px] text-gray-400">지도 기준</span>
      </div>
      <p className="text-xs text-gray-400 mb-3 ml-6">{formattedDate} ({dayName})</p>

      {isLoading ? (
        <LoadingSpinner message="중계 일정을 불러오는 중..." />
      ) : todayBroadcasts.length === 0 ? (
        <EmptyMessage message="오늘 중계되는 경기가 없습니다." />
      ) : (
        <>
          {/* 종목 탭 — pill 스타일 */}
          <nav className="flex justify-center gap-2 mb-4">
            {SPORTS.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  selectedSport === sport
                    ? "bg-primary5 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {sport} {sportCounts[sport]}
              </button>
            ))}
          </nav>

          {/* 경기 카드 */}
          <ul className="space-y-2.5">
            {filtered.length === 0 ? (
              <EmptyMessage message="오늘 중계되는 경기가 없습니다." />
            ) : (
              filtered.map((game) => {
                const status = getMatchStatus(game.match_time);
                const isLive = status === "live";
                const distance = getDistanceFromLatLon(
                  searchPosition.lat, searchPosition.lng,
                  game.lat, game.lng
                );

                return (
                  <li
                    key={`${game.store_id}-${game.match_time}-${game.league}`}
                    className={`rounded-xl border p-3.5 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-all bg-white ${
                      isLive ? "border-red-200 hover:border-red-300" : "border-gray-100 hover:border-primary1"
                    }`}
                    onClick={() => handleOpenDetail(game.store_id)}
                  >
                    <img
                      src={game.main_img || "/noimg.png"}
                      alt={game.store_name}
                      className="w-11 h-11 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {game.store_name}
                        </span>
                        <span className="text-[10px] text-gray-400">{distance}km</span>
                        {isLive && (
                          <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold flex-shrink-0 animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[10px] bg-primary4 text-primary5 rounded-full px-2 py-0.5 flex-shrink-0">
                          {game.league}
                        </span>
                        {game.team_one && game.team_two ? (
                          <>
                            <span className="font-medium text-gray-700">
                              {game.team_one}
                            </span>
                            <span className="text-gray-300">vs</span>
                            <span className="font-medium text-gray-700">
                              {game.team_two}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-gray-400">
                          {formatTimeShort(game.match_time)}
                        </span>
                        {!isLive && status !== "종료" && (
                          <span className="text-primary5 font-medium">{status}</span>
                        )}
                        {status === "종료" && (
                          <span className="text-gray-400">종료</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              }))
            }
          </ul>
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
