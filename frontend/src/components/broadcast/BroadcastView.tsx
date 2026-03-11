import { useEffect } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaBars, FaRegCalendarAlt } from "react-icons/fa";

import TabList from "./TabLists";
import Calendar from "./Calendar";
import useBroadcastStore, { dateInfo } from "@/stores/broadcastStore";
import { getBroadcast } from "@/api/broadcast.api";
import getDaysInMonth, { getToday } from "@/utils/dateUtils";
import useMypageStore from "@/stores/mypageStore";
import FloatingRegisterButton from "./FloatingRegisterButton";

const BroadcastView = () => {
  const twoMonthsAgo = new Date(dateInfo.year, dateInfo.month - 1 - 2);
  const twoMonthsLater = new Date(dateInfo.year, dateInfo.month - 1 + 2);
  const { setRestaurantSubpage } = useMypageStore();

  const {
    year,
    month,
    viewOption,
    setYear,
    setMonth,
    setDate,
    setViewOption,
    storeId,
    setBroadcastLists,
    scrollDateCenter,
  } = useBroadcastStore();

  const isInTwoMonths = (year: number, month: number) => {
    const target = new Date(year, month - 1);
    return target >= twoMonthsAgo && target <= twoMonthsLater;
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

  const fetchBroadcasts = async () => {
    if (!storeId) return;
    try {
      const broadcasts = await getBroadcast(storeId);
      setBroadcastLists(broadcasts);
    } catch {
      // 조회 실패 시 빈 목록 유지
    }
  };

  useEffect(() => {
    fetchBroadcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const { year: todayYear, month: todayMonth, date: todayDate } = getToday();

  return (
    <div className="flex flex-col pl-2 h-full">
      <div className="flex text-[28px] items-center justify-between mb-3 gap-3">
        <button
          className="text-[16px] px-2 py-1 rounded bg-primary1 text-mainText hover:bg-primary5 hover:text-white transition"
          onClick={() => {
            setYear(todayYear);
            setMonth(todayMonth);
            setDate(todayDate);

            setTimeout(() => {
              scrollDateCenter();
            }, 0);
          }}
        >
          오늘
        </button>

        <div className="flex items-center gap-3">
          <button
            className="hover:cursor-pointer text-[35px] disabled:text-lightgray"
            onClick={handleLeft}
            disabled={
              !isInTwoMonths(
                month > 1 ? year : year - 1,
                month > 1 ? month - 1 : 12
              )
            }
          >
            <MdKeyboardArrowLeft />
          </button>
          {year}.{month < 10 ? `0${month}` : month}
          <button
            className="hover:cursor-pointer text-[35px] disabled:text-lightgray"
            onClick={handleRight}
            disabled={
              !isInTwoMonths(
                month < 12 ? year : year + 1,
                month < 12 ? month + 1 : 1
              )
            }
          >
            <MdKeyboardArrowRight />
          </button>
        </div>

        <button
          className="text-[25px]"
          onClick={() => {
            setViewOption(viewOption === "tab" ? "calendar" : "tab");
          }}
        >
          {viewOption === "tab" ? <FaRegCalendarAlt /> : <FaBars />}
        </button>
      </div>

      <div className="relative h-full w-full">
        <div className="min-h-[400px]">
          {viewOption === "calendar" ? <Calendar /> : <TabList />}
        </div>
      </div>
      <FloatingRegisterButton
        className={`absolute bottom-10 right-10`}
        onClick={() => setRestaurantSubpage("broadcast-register")}
      />
    </div>
  );
};

export default BroadcastView;
