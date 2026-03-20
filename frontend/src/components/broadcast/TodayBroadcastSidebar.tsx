import { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import { FiTv, FiMapPin, FiClock, FiChevronDown } from "react-icons/fi";
import useMapStore from "@/stores/mapStore";
import useNearbyRestaurants from "@/hooks/useNearbyRestaurants";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import FallbackImage from "@/components/common/FallbackImage";
import EmptyMessage from "@/components/restaurant/EmptyMessage";
import type { Broadcast } from "@/types/restaurant.types";
import { formatTimeShort } from "@/utils/formatTime";
import { getToday } from "@/utils/dateUtils";
import { getDistanceFromLatLon } from "@/utils/distanceUtils";
import { CITY_STATION } from "@/constants/mapConstant";

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

type BroadcastWithStatus = TodayBroadcast & { _status: string };

/** 경기 카드 */
function BroadcastCard({
  game,
  userPosition,
  onClick,
}: {
  game: BroadcastWithStatus;
  userPosition: { lat: number; lng: number };
  onClick: () => void;
}) {
  // 실시간 카운트다운: 매 30초마다 상태 갱신
  const [status, setStatus] = useState(game._status);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStatus(getMatchStatus(game.match_time));
    intervalRef.current = setInterval(() => {
      setStatus(getMatchStatus(game.match_time));
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [game.match_time]);

  const isLive = status === "live";
  const isEnded = status === "종료";
  const isGpsAvailable =
    userPosition.lat !== CITY_STATION.lat || userPosition.lng !== CITY_STATION.lng;
  const distance = isGpsAvailable
    ? getDistanceFromLatLon(userPosition.lat, userPosition.lng, game.lat, game.lng)
    : null;

  return (
    <li
      onClick={onClick}
      className={`group rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
        isLive
          ? "bg-primary4/50 border-l-[3px] border-l-primary5 border border-primary1 hover:bg-primary4/70 shadow-sm"
          : isEnded
          ? "bg-gray-50/50 border border-gray-100 opacity-50"
          : "bg-white border border-gray-100 hover:border-primary5/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        <FallbackImage
          src={game.main_img || "/noimg.png"}
          alt={game.store_name}
          className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          {/* 가게명 + 상태 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-bold text-gray-800 truncate">
                {game.store_name}
              </span>
              {isLive && (
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-primary5 text-white rounded-full px-1.5 py-0.5 font-bold flex-shrink-0">
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <span className={`text-xs font-semibold flex-shrink-0 ml-2 ${
              isLive ? "text-primary5" : isEnded ? "text-gray-400" : "text-primary5"
            }`}>
              {isLive ? "중계중" : status}
            </span>
          </div>

          {/* 경기 정보 */}
          <div className="mt-1.5">
            {game.team_one && game.team_two ? (
              <p className="text-[13px] text-gray-700">
                <span className="font-semibold">{game.team_one}</span>
                <span className="text-gray-300 mx-1.5">vs</span>
                <span className="font-semibold">{game.team_two}</span>
              </p>
            ) : (
              <p className="text-[13px] text-gray-500">{game.sport}</p>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-gray-400">
            <span className="bg-gray-100 text-gray-600 rounded-md px-1.5 py-0.5 font-medium">
              {game.league}
            </span>
            <span className="flex items-center gap-0.5">
              <FiClock className="text-[10px]" />
              {formatTimeShort(game.match_time)}
            </span>
            {distance !== null && (
              <span className="flex items-center gap-0.5">
                <FiMapPin className="text-[10px]" />
                {distance}km
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

const TodayBroadcastSidebar = memo(function TodayBroadcastSidebar() {
  const myPosition = useMapStore((state) => state.myPosition);
  const bounds = useMapStore((state) => state.bounds);
  const { data: restaurants = [], isLoading } = useNearbyRestaurants(bounds);
  const openDetail = useMapStore((state) => state.openDetail);
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

  const effectiveSport = SPORTS.includes(selectedSport) ? selectedSport : SPORTS[0] ?? "";

  // 종목 탭 바뀌면 더보기 초기화
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
    setShowEnded(false);
  }, [effectiveSport]);

  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    todayBroadcasts.forEach((b) => {
      counts[b.sport] = (counts[b.sport] || 0) + 1;
    });
    return counts;
  }, [todayBroadcasts]);

  // status를 한 번만 계산 + 정렬: LIVE → 곧 시작(시간순) → 종료
  const filtered: BroadcastWithStatus[] = useMemo(() => {
    const withStatus = todayBroadcasts
      .filter((b) => b.sport === effectiveSport)
      .map((b) => ({ ...b, _status: getMatchStatus(b.match_time) }));
    const order = (s: string) => (s === "live" ? 0 : s === "종료" ? 2 : 1);
    withStatus.sort((a, b) => {
      if (order(a._status) !== order(b._status)) return order(a._status) - order(b._status);
      return a.match_time.localeCompare(b.match_time);
    });
    return withStatus;
  }, [todayBroadcasts, effectiveSport]);

  const activeGames = useMemo(
    () => filtered.filter((g) => g._status !== "종료"),
    [filtered]
  );
  const endedGames = useMemo(
    () => filtered.filter((g) => g._status === "종료"),
    [filtered]
  );
  const visibleActive = activeGames.slice(0, visibleCount);

  const handleOpenDetail = useCallback(
    (storeId: number) => openDetail(storeId, "중계"),
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
                  effectiveSport === sport
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
                    userPosition={myPosition}
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
                          userPosition={myPosition}
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

    </section>
  );
});

export default TodayBroadcastSidebar;
