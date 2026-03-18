import { Fragment, useState, useMemo } from "react";
import { FiTv, FiChevronDown, FiChevronUp, FiVolume2 } from "react-icons/fi";
import Button from "@/components/common/Button";
import type { RestaurantDetail, BroadcastWithId } from "@/types/restaurant.types";
import EmptyMessage from "./EmptyMessage";
import useBroadcastStore from "@/stores/broadcastStore";
import useMypageStore from "@/stores/mypageStore";
import { formatTimeShort } from "@/utils/formatTime";
import { getToday } from "@/utils/dateUtils";

function getKoreanDateString(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function groupByDate(broadcasts: BroadcastWithId[]): Record<string, BroadcastWithId[]> {
  return broadcasts.reduce((acc, b) => {
    (acc[b.match_date] = acc[b.match_date] || []).push(b);
    return acc;
  }, {} as Record<string, BroadcastWithId[]>);
}

/** 중계 카드 (미래/과거 공용) */
function BroadcastCard({ b, isPast }: { b: BroadcastWithId; isPast?: boolean }) {
  const baseStyle = isPast
    ? "border-gray-200 bg-gray-50"
    : "border-primary2 bg-white";
  const textColor = isPast ? "text-gray-500" : "text-gray-700";
  const teamColor = isPast ? "text-gray-500" : "text-gray-800";
  const vsColor = isPast ? "text-gray-400" : "text-primary5";
  const badgeBg = isPast ? "bg-gray-200 text-gray-500" : "bg-primary4 text-primary5";

  return (
    <li className={`rounded-xl p-4 mb-3 flex flex-col gap-2 border ${baseStyle}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs rounded px-2 py-0.5 ${badgeBg}`}>{b.league}</span>
        <span className={`font-semibold ${textColor}`}>{b.sport}</span>
        <span className="ml-auto text-xs text-gray-400">{formatTimeShort(b.match_time)}</span>
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
function DateHeader({ date, isPast }: { date: string; isPast?: boolean }) {
  const color = isPast ? "text-gray-400" : "text-primary5";
  const subColor = isPast ? "text-gray-300" : "text-gray-400";
  return (
    <h4 className={`mb-2 mt-4 first:mt-0 text-sm font-bold ${color} flex items-center gap-2`}>
      <FiTv />
      {getKoreanDateString(date)}
      <span className={`text-xs font-normal ml-2 ${subColor}`}>{date}</span>
    </h4>
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

  const { sortedFutureDates, groupedFuture, sortedPastDates, groupedPast, futureCount, pastCount } =
    useMemo(() => {
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

      return {
        sortedFutureDates, groupedFuture,
        sortedPastDates, groupedPast,
        futureCount: future.length, pastCount: past.length,
      };
    }, [detail.broadcasts, today]);

  const { setStore } = useBroadcastStore();
  const { setRestaurantSubpage, setSelectedTab, setIsMypageOpen } = useMypageStore();

  return (
    <div>
      {/* 예정 중계 */}
      <ul>
        {futureCount === 0 ? (
          <li><EmptyMessage message="예정된 중계 정보가 없습니다." /></li>
        ) : (
          sortedFutureDates.map((date) => (
            <Fragment key={date}>
              <DateHeader date={date} />
              {groupedFuture[date].map((b) => (
                <BroadcastCard key={b.broadcast_id} b={b} />
              ))}
            </Fragment>
          ))
        )}
      </ul>

      {/* 지난 중계 토글 */}
      {pastCount > 0 && (
        <div className="mt-6">
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
                  <DateHeader date={date} isPast />
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
        <div className="mt-8 flex justify-end">
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
