import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { FiTv, FiMapPin, FiClock, FiChevronDown } from "react-icons/fi";
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

type TodayBroadcast = Broadcast & {
  store_name: string;
  store_id: number;
  main_img: string | null;
  address: string;
  type: string;
  lat: number;
  lng: number;
};

const getMatchStatus = (matchTime: string) => {
  const now = new Date();
  const [h, m] = matchTime.split(":").map(Number);
  const matchStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000);

  if (now >= matchStart && now <= matchEnd) return "live";
  if (matchStart > now) {
    const diffMin = Math.floor((matchStart.getTime() - now.getTime()) / 60000);
    if (diffMin <= 60) return `${diffMin}분 후`;
    return `${Math.floor(diffMin / 60)}시간 후`;
  }
  return "종료";
};

/** 경기 카드 */
function BroadcastCard({
  game,
  searchPosition,
  onClick,
}: {
  game: TodayBroadcast;
  searchPosition: { lat: number; lng: number };
  onClick: () => void;
}) {
  const status = getMatchStatus(game.match_time);
  const isLive = status === "live";
  const isEnded = status === "종료";
  const distance = getDistanceFromLatLon(
    searchPosition.lat, searchPosition.lng,
    game.lat, game.lng
  );

  return (
    <li
      onClick={onClick}
      className={`group rounded-2xl p-3 cursor-pointer transition-all ${
        isLive
          ? "bg-red-50/60 border border-red-100 hover:shadow-md hover:border-red-200"
          : isEnded
          ? "bg-white border border-gray-100 opacity-60"
          : "bg-white border border-gray-100 hover:shadow-md hover:border-primary2"
      }`}
    >
      {/* 상단: 가게 정보 */}
      <div className="flex items-center gap-2.5">
        <img
          src={game.main_img || "/noimg.png"}
          alt={game.store_name}
          className="w-10 h-10 rounded-xl object-cover bg-gray-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-gray-800 truncate">
              {game.store_name}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-red-500 text-white rounded-full px-1.5 py-px font-bold flex-shrink-0">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
            <span className="flex items-center gap-0.5">
              <FiMapPin className="text-[10px]" />
              {distance}km
            </span>
            <span className="flex items-center gap-0.5">
              <FiClock className="text-[10px]" />
              {formatTimeShort(game.match_time)}
            </span>
          </div>
        </div>
        {/* 상태 뱃지 */}
        <div className="flex-shrink-0">
          {isLive ? (
            <span className="text-[10px] text-red-500 font-bold">중계중</span>
          ) : isEnded ? (
            <span className="text-[10px] text-gray-400">종료</span>
          ) : (
            <span className="text-[10px] text-primary5 font-semibold">{status}</span>
          )}
        </div>
      </div>

      {/* 하단: 경기 정보 */}
      <div className="mt-2 pt-2 border-t border-gray-100/80">
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-gray-100 text-gray-600 rounded-md px-1.5 py-0.5 font-medium flex-shrink-0">
            {game.league}
          </span>
          {game.team_one && game.team_two ? (
            <span className="text-xs text-gray-700 truncate">
              <span className="font-medium">{game.team_one}</span>
              <span className="text-gray-300 mx-1">vs</span>
              <span className="font-medium">{game.team_two}</span>
            </span>
          ) : (
            <span className="text-xs text-gray-500">{game.sport}</span>
          )}
        </div>
      </div>
    </li>
  );
}

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
  const [showEnded, setShowEnded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const INITIAL_COUNT = 5;

  useEffect(() => {
    if (!SPORTS.includes(selectedSport)) {
      if (SPORTS.length > 0) setSelectedSport(SPORTS[0]);
      else setSelectedSport("");
    }
  }, [SPORTS, selectedSport]);

  // 종목 탭 바뀌면 더보기 초기화
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
    setShowEnded(false);
  }, [selectedSport]);

  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    todayBroadcasts.forEach((b) => {
      counts[b.sport] = (counts[b.sport] || 0) + 1;
    });
    return counts;
  }, [todayBroadcasts]);

  // 정렬: LIVE → 곧 시작(시간순) → 종료
  const filtered = useMemo(() => {
    const sportFiltered = todayBroadcasts.filter((b) => b.sport === selectedSport);
    return sportFiltered.sort((a, b) => {
      const sa = getMatchStatus(a.match_time);
      const sb = getMatchStatus(b.match_time);
      const order = (s: string) => (s === "live" ? 0 : s === "종료" ? 2 : 1);
      if (order(sa) !== order(sb)) return order(sa) - order(sb);
      return a.match_time.localeCompare(b.match_time);
    });
  }, [todayBroadcasts, selectedSport]);

  const activeGames = useMemo(
    () => filtered.filter((g) => getMatchStatus(g.match_time) !== "종료"),
    [filtered]
  );
  const endedGames = useMemo(
    () => filtered.filter((g) => getMatchStatus(g.match_time) === "종료"),
    [filtered]
  );
  const visibleActive = activeGames.slice(0, visibleCount);

  const handleOpenDetail = useCallback(
    (storeId: number) => openDetail(storeId),
    [openDetail]
  );

  const todayDate = new Date();
  const formattedDate = `${todayDate.getFullYear()}.${String(todayDate.getMonth() + 1).padStart(2, "0")}.${String(todayDate.getDate()).padStart(2, "0")}`;
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[todayDate.getDay()];

  return (
    <section className="w-full">
      {/* 헤더 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiTv className="text-primary5" />
            <span className="text-sm font-bold text-gray-800">오늘의 중계</span>
          </div>
          <span className="text-[11px] text-gray-400">
            {formattedDate} ({dayName})
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 ml-6">
          지도 위치 기준 주변 가게 · {todayBroadcasts.length}경기
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="중계 일정을 불러오는 중..." />
      ) : todayBroadcasts.length === 0 ? (
        <EmptyMessage message="오늘 중계되는 경기가 없습니다." />
      ) : (
        <>
          {/* 종목 필터 */}
          <div className="flex gap-1.5 mb-3">
            {SPORTS.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all ${
                  selectedSport === sport
                    ? "bg-primary5 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-primary5 hover:text-primary5"
                }`}
              >
                {sport} {sportCounts[sport]}
              </button>
            ))}
          </div>

          {/* 경기 리스트 */}
          {activeGames.length === 0 && endedGames.length === 0 ? (
            <EmptyMessage message="선택한 종목의 경기가 없습니다." />
          ) : (
            <>
              <ul className="space-y-2">
                {visibleActive.map((game) => (
                  <BroadcastCard
                    key={`${game.store_id}-${game.match_time}-${game.league}`}
                    game={game}
                    searchPosition={searchPosition}
                    onClick={() => handleOpenDetail(game.store_id)}
                  />
                ))}
              </ul>

              {/* 더보기 */}
              {activeGames.length > visibleCount && (
                <button
                  onClick={() => setVisibleCount((c) => c + 5)}
                  className="w-full mt-2 py-2 text-xs text-gray-500 hover:text-primary5 flex items-center justify-center gap-1 transition-colors"
                >
                  <FiChevronDown />
                  {activeGames.length - visibleCount}개 더보기
                </button>
              )}

              {/* 종료된 경기 */}
              {endedGames.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowEnded(!showEnded)}
                    className="w-full py-2 text-[11px] text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 border-t border-gray-100 transition-colors"
                  >
                    종료된 경기 {endedGames.length}개
                    <FiChevronDown className={`transition-transform ${showEnded ? "rotate-180" : ""}`} />
                  </button>
                  {showEnded && (
                    <ul className="space-y-2 mt-2">
                      {endedGames.map((game) => (
                        <BroadcastCard
                          key={`${game.store_id}-${game.match_time}-${game.league}`}
                          game={game}
                          searchPosition={searchPosition}
                          onClick={() => handleOpenDetail(game.store_id)}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
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
