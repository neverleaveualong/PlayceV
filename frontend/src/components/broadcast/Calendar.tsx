import { memo, useMemo } from "react";
import useBroadcastStore from "@/stores/broadcastStore";
import getDaysInMonth, { getDayIdx, getToday } from "@/utils/dateUtils";
import useBroadcasts from "@/hooks/useBroadcasts";

interface CalendarProps {
  scrollToDate: (date: number) => void;
}

const Calendar = memo(function Calendar({ scrollToDate }: CalendarProps) {
  const { year, month, setDate, setViewOption, storeId } = useBroadcastStore();
  const { data: broadcastLists = [] } = useBroadcasts(storeId);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getDayIdx(year, month, 1);
  const weeks: (number | null)[][] = [];

  let currentDay = 1;
  while (currentDay <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (weeks.length === 0 && i < firstDayOfWeek) {
        week.push(null);
      } else if (currentDay > daysInMonth) {
        week.push(null);
      } else {
        week.push(currentDay++);
      }
    }
    weeks.push(week);
  }

  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];
  const { year: todayYear, month: todayMonth, date: todayDate } = getToday();

  const broadcastCountMap = useMemo(
    () =>
      broadcastLists.reduce((acc, item) => {
        const date = new Date(item.match_date);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const key = `${y}-${m}-${d}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    [broadcastLists]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {weekdayLabels.map((day, i) => (
          <div
            className={`text-center text-xs font-bold py-2.5 ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"
            }`}
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 주간 그리드 */}
      {weeks.map((week, weekIdx) => (
        <div
          key={weekIdx}
          className={`grid grid-cols-7 ${
            weekIdx < weeks.length - 1 ? "border-b border-gray-100" : ""
          }`}
        >
          {week.map((day, dayIdx) => {
            const key = day ? `${year}-${month}-${day}` : null;
            const isToday =
              year === todayYear && month === todayMonth && day === todayDate;
            const count = key ? broadcastCountMap[key] ?? 0 : 0;
            const isSun = dayIdx === 0;
            const isSat = dayIdx === 6;

            return (
              <div
                className={`flex justify-center py-1.5 ${
                  day
                    ? "cursor-pointer hover:bg-primary4/20 transition-colors"
                    : ""
                }`}
                key={dayIdx}
                onClick={() => {
                  if (!day) return;
                  setDate(day);
                  setViewOption("tab");
                  setTimeout(() => scrollToDate(day), 0);
                }}
              >
                {day && (
                  <div className="flex flex-col items-center gap-0.5 w-9 py-1">
                    <span
                      className={`text-[13px] font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-primary5 text-white ring-2 ring-primary5/30 ring-offset-1"
                          : isSun
                          ? "text-red-500"
                          : isSat
                          ? "text-blue-500"
                          : "text-mainText"
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && !count ? (
                      <span className="text-[8px] text-primary5 font-bold leading-none">TODAY</span>
                    ) : count > 0 ? (
                      <span className="text-[9px] text-primary5 font-bold leading-none">
                        {count}경기
                      </span>
                    ) : (
                      <span className="text-[9px] leading-none">&nbsp;</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

export default Calendar;
