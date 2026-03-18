import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaBars, FaRegCalendarAlt } from "react-icons/fa";

import TabList from "./TabLists";
import Calendar from "./Calendar";
import useBroadcastStore, { dateInfo } from "@/stores/broadcastStore";
import getDaysInMonth, { getToday } from "@/utils/dateUtils";
import FloatingRegisterButton from "./FloatingRegisterButton";
import useDateScroll from "@/hooks/useDateScroll";

const CALENDAR_RANGE_MONTHS = 2;

interface BroadcastViewProps {
  onRegister?: () => void;
}

const BroadcastView = ({ onRegister }: BroadcastViewProps = {}) => {
  const rangeStart = new Date(dateInfo.year, dateInfo.month - 1 - CALENDAR_RANGE_MONTHS);
  const rangeEnd = new Date(dateInfo.year, dateInfo.month - 1 + CALENDAR_RANGE_MONTHS);
  const { tabRef, itemRefs, scrollToDate } = useDateScroll();

  const {
    year,
    month,
    viewOption,
    setYear,
    setMonth,
    setDate,
    setViewOption,
  } = useBroadcastStore();

  const isInRange = (year: number, month: number) => {
    const target = new Date(year, month - 1);
    return target >= rangeStart && target <= rangeEnd;
  };

  const handleLeft = () => {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setYear(newYear);
    setMonth(newMonth);
    setDate(getDaysInMonth(newYear, newMonth));
  };

  const handleRight = () => {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setYear(newYear);
    setMonth(newMonth);
    setDate(1);
  };

  const { year: todayYear, month: todayMonth, date: todayDate } = getToday();

  return (
    <div className="flex flex-col h-full">
      {/* 날짜 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            setYear(todayYear);
            setMonth(todayMonth);
            setDate(todayDate);
            setTimeout(() => scrollToDate(todayDate), 0);
          }}
          className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-darkgray hover:border-primary5 hover:text-primary5 transition-colors"
        >
          오늘
        </button>

        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
            onClick={handleLeft}
            disabled={!isInRange(month > 1 ? year : year - 1, month > 1 ? month - 1 : 12)}
          >
            <MdKeyboardArrowLeft className="text-xl" />
          </button>
          <span className="text-base font-bold text-mainText min-w-[80px] text-center">
            {year}.{month < 10 ? `0${month}` : month}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
            onClick={handleRight}
            disabled={!isInRange(month < 12 ? year : year + 1, month < 12 ? month + 1 : 1)}
          >
            <MdKeyboardArrowRight className="text-xl" />
          </button>
        </div>

        <button
          onClick={() => setViewOption(viewOption === "tab" ? "calendar" : "tab")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-darkgray transition-colors"
        >
          {viewOption === "tab" ? <FaRegCalendarAlt className="text-base" /> : <FaBars className="text-base" />}
        </button>
      </div>

      <div className="relative h-full w-full">
        <div className="min-h-[400px]">
          {viewOption === "calendar" ? (
            <Calendar scrollToDate={scrollToDate} />
          ) : (
            <TabList tabRef={tabRef} itemRefs={itemRefs} scrollToDate={scrollToDate} />
          )}
        </div>
      </div>
      {onRegister && (
        <FloatingRegisterButton
          className="absolute bottom-10 right-10"
          onClick={onRegister}
        />
      )}
    </div>
  );
};

export default BroadcastView;
