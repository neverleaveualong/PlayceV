import { Fragment, useState, useMemo, useCallback, useRef, useEffect } from "react";
import { FiTv, FiChevronDown, FiChevronUp, FiVolume2, FiCalendar } from "react-icons/fi";
import { MdToday } from "react-icons/md";
import { IoBaseball, IoBasketball, IoFootball, IoGameController } from "react-icons/io5";
import Button from "@/components/common/Button";
import type { RestaurantDetail, BroadcastWithId } from "@/types/restaurant.types";
import EmptyMessage from "./EmptyMessage";
import useBroadcastStore from "@/stores/broadcastStore";
import useMypageStore from "@/stores/mypageStore";
import { formatTimeShort } from "@/utils/formatTime";
import { getToday } from "@/utils/dateUtils";

/** 종목별 아이콘 */
const SPORT_ICON: Record<string, React.ReactNode> = {
  야구: <IoBaseball />,
  농구: <IoBasketball />,
  축구: <IoFootball />,
  "e스포츠": <IoGameController />,
};

/** 리그별 색상 (bg, text, border) */
const LEAGUE_STYLE: Record<string, { bg: string; text: string }> = {
  "KBO 리그": { bg: "bg-blue-100", text: "text-blue-700" },
  NBA: { bg: "bg-red-100", text: "text-red-700" },
  KBL: { bg: "bg-orange-100", text: "text-orange-700" },
  LCK: { bg: "bg-amber-100", text: "text-amber-700" },
  "K리그": { bg: "bg-green-100", text: "text-green-700" },
  EPL: { bg: "bg-purple-100", text: "text-purple-700" },
  UCL: { bg: "bg-indigo-100", text: "text-indigo-700" },
  MLB: { bg: "bg-sky-100", text: "text-sky-700" },
};

const DEFAULT_LEAGUE_STYLE = { bg: "bg-gray-100", text: "text-gray-600" };
const PAST_LEAGUE_STYLE = { bg: "bg-gray-200", text: "text-gray-500" };

/** 경기 평균 2시간 기준 LIVE 판별 */
function isLiveBroadcast(matchDate: string, matchTime: string, today: string): boolean {
  if (matchDate !== today) return false;
  const now = new Date();
  const [h, m] = matchTime.split(":").map(Number);
  const start = new Date();
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return now >= start && now <= end;
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function getFullDateString(dateStr: string): string {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = DAY_NAMES[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

/** "2026-03" 형태의 월 키 추출 */
function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  return `${year}년 ${Number(month)}월`;
}

function groupByDate(broadcasts: BroadcastWithId[]): Record<string, BroadcastWithId[]> {
  return broadcasts.reduce((acc, b) => {
    (acc[b.match_date] = acc[b.match_date] || []).push(b);
    return acc;
  }, {} as Record<string, BroadcastWithId[]>);
}

/** 날짜 배열을 월별로 그룹핑 */
function groupDatesByMonth(dates: string[]): Record<string, string[]> {
  return dates.reduce((acc, date) => {
    const key = getMonthKey(date);
    (acc[key] = acc[key] || []).push(date);
    return acc;
  }, {} as Record<string, string[]>);
}

/** 중계 카드 (미래/과거 공용) */
function BroadcastCard({ b, isPast, isLive }: { b: BroadcastWithId; isPast?: boolean; isLive?: boolean }) {
  const baseStyle = isLive
    ? "border-red-400 bg-red-50/30 ring-1 ring-red-200"
    : isPast
      ? "border-gray-200 bg-gray-50"
      : "border-primary2 bg-white";
  const teamColor = isPast ? "text-gray-500" : "text-gray-800";
  const vsColor = isPast ? "text-gray-400" : "text-primary5";
  const timeColor = isLive ? "text-red-500" : isPast ? "text-gray-400" : "text-primary5";
  const sportIconColor = isPast ? "text-gray-400" : "text-gray-600";
  const leagueStyle = isPast ? PAST_LEAGUE_STYLE : (LEAGUE_STYLE[b.league] ?? DEFAULT_LEAGUE_STYLE);
  const sportIcon = SPORT_ICON[b.sport];

  return (
    <li className={`rounded-xl p-4 mb-3 flex flex-col gap-2 border ${baseStyle}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-sm font-bold ${timeColor}`}>{formatTimeShort(b.match_time)}</span>
        {isLive && (
          <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-100 rounded px-1.5 py-0.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            LIVE
          </span>
        )}
        <span className={`text-xs font-semibold rounded px-2 py-0.5 ${leagueStyle.bg} ${leagueStyle.text}`}>
          {b.league}
        </span>
        {sportIcon && <span className={`text-base ${sportIconColor}`}>{sportIcon}</span>}
        <span className={`text-sm font-medium ${sportIconColor}`}>{b.sport}</span>
      </div>
      {b.team_one && b.team_two && (
        <div className={`flex items-center gap-2 text-base font-bold ${teamColor}`}>
          <span>{b.team_one}</span>
          <span className={`mx-1 ${vsColor}`}>vs</span>
          <span>{b.team_two}</span>
        </div>
      )}
      {b.etc && (
        <div className="mt-1 flex items-start gap-2 text-xs text-gray-600">
          <FiVolume2 className="text-primary5 text-base flex-shrink-0 mt-0.5" />
          <span className="whitespace-pre-line break-words">{b.etc}</span>
        </div>
      )}
    </li>
  );
}

/** 날짜 그룹 헤더 */
function DateHeader({ date, count, isPast }: { date: string; count: number; isPast?: boolean }) {
  const bg = isPast ? "bg-gray-50" : "bg-primary4/20";
  const color = isPast ? "text-gray-400" : "text-primary5";
  const countColor = isPast ? "text-gray-400" : "text-primary5/70";
  return (
    <h4 className={`mb-2 mt-4 first:mt-0 text-sm font-bold ${color} flex items-center gap-2
      ${bg} rounded-lg px-3 py-2`}>
      <FiTv className="flex-shrink-0" />
      {getFullDateString(date)}
      <span className={`ml-auto text-xs font-medium ${countColor}`}>{count}경기</span>
    </h4>
  );
}

/** 월별 Accordion 헤더 */
function MonthAccordionHeader({
  monthKey,
  count,
  isOpen,
  isPast,
  onToggle,
}: {
  monthKey: string;
  count: number;
  isOpen: boolean;
  isPast?: boolean;
  onToggle: () => void;
}) {
  const bg = isPast
    ? "bg-gray-50 border-gray-200 text-gray-400"
    : isOpen
      ? "bg-primary4/30 border-primary2 text-primary5"
      : "bg-gray-50 border-gray-200 text-gray-600";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border
        font-semibold text-sm transition-colors ${bg}`}
    >
      <span className="flex items-center gap-2">
        <FiCalendar className="text-base" />
        {getMonthLabel(monthKey)}
        <span className="text-xs font-normal opacity-70">{count}경기</span>
      </span>
      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
    </button>
  );
}

interface RestaurantDetailBroadcastTabProps {
  detail: RestaurantDetail;
  storeId: number;
}

export default function RestaurantDetailBroadcastTab({
  detail,
  storeId,
}: RestaurantDetailBroadcastTabProps) {
  const [showPast, setShowPast] = useState(false);
  const { dateString: today } = getToday();
  const currentMonth = getMonthKey(today);

  const {
    sortedFutureMonths, monthlyFutureDates, groupedFuture, futureMonthCounts,
    sortedPastDates, groupedPast, futureCount, pastCount,
  } = useMemo(() => {
    const future: BroadcastWithId[] = [];
    const past: BroadcastWithId[] = [];
    detail.broadcasts.forEach((b: BroadcastWithId) => {
      if (b.match_date >= today) future.push(b);
      else past.push(b);
    });

    const groupedFuture = groupByDate(future);
    const groupedPast = groupByDate(past);
    const sortedFutureDates = Object.keys(groupedFuture).sort();
    const sortedPastDates = Object.keys(groupedPast).sort().reverse();

    // 시간순 정렬
    sortedFutureDates.forEach((d) => groupedFuture[d].sort((a, b) => a.match_time.localeCompare(b.match_time)));
    sortedPastDates.forEach((d) => groupedPast[d].sort((a, b) => a.match_time.localeCompare(b.match_time)));

    // 월별 그룹핑
    const monthlyFutureDates = groupDatesByMonth(sortedFutureDates);
    const sortedFutureMonths = Object.keys(monthlyFutureDates).sort();

    // 월별 경기 수
    const futureMonthCounts: Record<string, number> = {};
    for (const month of sortedFutureMonths) {
      futureMonthCounts[month] = monthlyFutureDates[month].reduce(
        (sum, date) => sum + groupedFuture[date].length, 0
      );
    }

    return {
      sortedFutureMonths, monthlyFutureDates, groupedFuture, futureMonthCounts,
      sortedPastDates, groupedPast,
      futureCount: future.length, pastCount: past.length,
    };
  }, [detail.broadcasts, today]);

  // 현재 월만 기본 펼침
  const [openMonths, setOpenMonths] = useState<Set<string>>(() => new Set([currentMonth]));

  const toggleMonth = useCallback((month: string) => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }, []);

  const { setStore } = useBroadcastStore();
  const { setRestaurantSubpage, setSelectedTab, setIsMypageOpen } = useMypageStore();

  const currentMonthRef = useRef<HTMLDivElement>(null);
  const [showGoToToday, setShowGoToToday] = useState(false);

  // IntersectionObserver로 현재 월이 화면에서 벗어나면 버튼 표시
  useEffect(() => {
    const el = currentMonthRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowGoToToday(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sortedFutureMonths]);

  const handleGoToToday = useCallback(() => {
    // 현재 월 열기
    setOpenMonths((prev) => {
      const next = new Set(prev);
      next.add(currentMonth);
      return next;
    });
    // 스크롤 이동
    setTimeout(() => {
      currentMonthRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [currentMonth]);

  return (
    <div className="flex flex-col gap-3">
      {/* 오늘로 돌아가기 버튼 - 스크롤로 현재 월이 벗어나면 표시 */}
      {futureCount > 0 && showGoToToday && (
        <button
          type="button"
          onClick={handleGoToToday}
          className="sticky top-0 z-10 flex items-center justify-center gap-1.5
            text-xs font-semibold text-white bg-primary5 rounded-full px-4 py-2
            shadow-md hover:bg-primary5/90 transition-colors self-center"
        >
          <MdToday className="text-sm" />
          오늘로 돌아가기
        </button>
      )}

      {/* 예정 중계 */}
      {futureCount === 0 ? (
        <EmptyMessage message="예정된 중계 정보가 없습니다." />
      ) : (
        sortedFutureMonths.map((month) => {
          const isOpen = openMonths.has(month);
          const isCurrent = month === currentMonth;
          return (
            <div key={month} ref={isCurrent ? currentMonthRef : undefined}>
              <MonthAccordionHeader
                monthKey={month}
                count={futureMonthCounts[month]}
                isOpen={isOpen}
                onToggle={() => toggleMonth(month)}
              />
              {isOpen && (
                <ul className="mt-2">
                  {monthlyFutureDates[month].map((date) => (
                    <Fragment key={date}>
                      <DateHeader date={date} count={groupedFuture[date].length} />
                      {groupedFuture[date].map((b) => (
                        <BroadcastCard
                          key={b.broadcast_id}
                          b={b}
                          isLive={isLiveBroadcast(b.match_date, b.match_time, today)}
                        />
                      ))}
                    </Fragment>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      )}

      {/* 지난 중계 토글 */}
      {pastCount > 0 && (
        <div className="mt-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-400
              hover:text-primary5 font-medium py-2 transition-colors"
            onClick={() => setShowPast((v) => !v)}
          >
            {showPast ? <FiChevronUp /> : <FiChevronDown />}
            지난 중계일정 {showPast ? "닫기" : `보기 (${pastCount})`}
          </button>
          {showPast && (
            <ul className="mt-2">
              {sortedPastDates.map((date) => (
                <Fragment key={date}>
                  <DateHeader date={date} count={groupedPast[date].length} isPast />
                  {groupedPast[date].map((b) => (
                    <BroadcastCard key={b.broadcast_id} b={b} isPast />
                  ))}
                </Fragment>
              ))}
            </ul>
          )}
        </div>
      )}

      {detail.is_owner && (
        <div className="mt-5 flex justify-end">
          <Button
            scheme="primary"
            onClick={() => {
              setRestaurantSubpage("restaurant-home");
              setSelectedTab("broadcast");
              setStore(storeId);
              setIsMypageOpen(true);
            }}
          >
            중계 관리
          </Button>
        </div>
      )}
    </div>
  );
}
