import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import getDaysInMonth, { getDay, getToday } from "@/utils/dateUtils";
import { useState, useEffect, useMemo } from "react";
import useBroadcastStore from "@/stores/broadcastStore";
import ConfirmModal from "@/components/common/ConfirmModal";
import { formatTime } from "@/utils/formatTime";
import useToastStore from "@/stores/toastStore";
import useMypageStore from "@/stores/mypageStore";
import useBroadcasts, { useDeleteBroadcast } from "@/hooks/useBroadcasts";
import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi";

interface TabListProps {
  tabRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.RefObject<Map<number, HTMLDivElement>>;
  scrollToDate: (date: number) => void;
}

const TabList = ({ tabRef, itemRefs, scrollToDate }: TabListProps) => {
  const { year, month, date, setDate, storeId, setEditingId } =
    useBroadcastStore();
  const scrollAmount = 150;
  const { data: broadcastLists = [] } = useBroadcasts(storeId);
  const deleteMutation = useDeleteBroadcast(storeId);
  const { setRestaurantSubpage } = useMypageStore();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    scrollToDate(date);
  }, [scrollToDate, date]);

  const handleScrollLeft = () => {
    tabRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    tabRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const dateArray = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  const currentDate = `${year}-${String(month).padStart(2, "0")}-${String(
    date
  ).padStart(2, "0")}`;

  const broadcastsForSelectedDate = useMemo(
    () =>
      broadcastLists
        .filter((b) => b.match_date === currentDate)
        .sort((a, b) => a.match_time.localeCompare(b.match_time)),
    [broadcastLists, currentDate]
  );

  // 날짜별 중계 개수 (dot 표시용)
  const broadcastCountByDate = useMemo(() => {
    const map: Record<number, number> = {};
    broadcastLists.forEach((b) => {
      const d = new Date(b.match_date);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        const day = d.getDate();
        map[day] = (map[day] || 0) + 1;
      }
    });
    return map;
  }, [broadcastLists, year, month]);

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => useToastStore.getState().addToast("삭제되었습니다.", "success"),
      onError: () => useToastStore.getState().addToast("삭제에 실패했습니다.", "error"),
    });
  };

  const { year: todayYear, month: todayMonth, date: todayDate } = getToday();

  return (
    <div>
      {/* 날짜 스크롤러 */}
      <div className="flex items-center gap-1">
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0 transition-colors"
          onClick={handleScrollLeft}
        >
          <MdKeyboardArrowLeft className="text-lg" />
        </button>
        <div
          className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1 flex-1"
          ref={tabRef}
        >
          {dateArray.map((d) => {
            const isToday =
              d === todayDate && month === todayMonth && year === todayYear;
            const isSelected = d === date;
            const hasBroadcast = !!broadcastCountByDate[d];
            const dayName = getDay(year, month, d);
            const isSun = dayName === "일";
            const isSat = dayName === "토";
            // 일요일이고 1일이 아니면 주 구분 간격
            const isWeekStart = isSun && d !== 1;

            const dayColor = isSelected
              ? "text-white/70"
              : isSun
              ? "text-red-400"
              : isSat
              ? "text-blue-400"
              : "text-darkgray";

            const dateColor = isSelected
              ? ""
              : isSun
              ? "text-red-500"
              : isSat
              ? "text-blue-500"
              : "";

            return (
              <div
                key={d}
                ref={(el) => {
                  if (el) itemRefs.current.set(d, el);
                  else itemRefs.current.delete(d);
                }}
                className={`relative flex flex-col items-center justify-center w-10 rounded-xl flex-shrink-0 cursor-pointer transition-all duration-150 ${
                  isWeekStart ? "ml-3" : ""
                } ${
                  isToday && !isSelected ? "h-[62px]" : "h-14"
                } ${
                  isSelected
                    ? "bg-primary5 text-white shadow-sm"
                    : isToday
                    ? "bg-primary4/60 text-primary5 ring-2 ring-primary5/30"
                    : "hover:bg-gray-100 text-mainText"
                }`}
                onClick={() => setDate(d)}
              >
                {isToday && !isSelected && (
                  <span className="text-[8px] font-bold text-primary5 leading-none mb-0.5">TODAY</span>
                )}
                <span className={`text-[10px] leading-none ${dayColor}`}>
                  {dayName}
                </span>
                <span className={`text-sm font-bold mt-0.5 ${dateColor}`}>{d}</span>
                {hasBroadcast && (
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-primary5"}`} />
                )}
              </div>
            );
          })}
        </div>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0 transition-colors"
          onClick={handleScrollRight}
        >
          <MdKeyboardArrowRight className="text-lg" />
        </button>
      </div>

      {/* 중계 리스트 */}
      <div className="mt-4 space-y-2">
        {broadcastsForSelectedDate.length > 0 ? (
          broadcastsForSelectedDate.map((b) => (
            <div
              key={b.broadcast_id}
              className="group relative rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm hover:bg-primary4/20 transition-colors"
            >
              {/* 상단: 리그 + 시간 */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-gray-100 text-gray-600 rounded-md px-1.5 py-0.5 font-medium">
                  {b.league}
                </span>
                <div className="flex items-center gap-1 text-xs text-darkgray">
                  <FiClock className="text-[10px]" />
                  {formatTime(b.match_time)}
                </div>
              </div>

              {/* 팀 정보 */}
              {b.team_one && b.team_two ? (
                <p className="text-sm font-semibold text-mainText truncate pr-16">
                  {b.team_one}
                  <span className="text-gray-400 mx-1.5">vs</span>
                  {b.team_two}
                </p>
              ) : (
                <p className="text-sm text-gray-500">{b.sport}</p>
              )}

              {b.etc && (
                <p className="text-xs text-darkgray mt-1 truncate">{b.etc}</p>
              )}

              {/* 액션 버튼 — hover 시 표시 */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-150">
                <button
                  onClick={() => {
                    setEditingId(b.broadcast_id);
                    setRestaurantSubpage("broadcast-edit");
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all"
                  title="수정"
                >
                  <FiEdit2 className="text-blue-500 text-[11px]" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(b.broadcast_id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"
                  title="삭제"
                >
                  <FiTrash2 className="text-red-500 text-[11px]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-10 gap-2">
            <p className="text-sm text-gray-400">등록된 중계가 없습니다</p>
            <p className="text-xs text-gray-300">우측 하단 + 버튼으로 등록해보세요</p>
          </div>
        )}
      </div>

      {deleteTargetId !== null && (
        <ConfirmModal
          message="중계 일정을 삭제하시겠습니까?"
          variant="danger"
          confirmLabel="삭제"
          onConfirm={() => {
            handleDelete(deleteTargetId);
            setDeleteTargetId(null);
          }}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
};

export default TabList;
