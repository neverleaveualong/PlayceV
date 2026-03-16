import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import getDaysInMonth, { getDay, getToday } from "@/utils/dateUtils";
import { useState, useEffect, useMemo } from "react";
import useBroadcastStore from "@/stores/broadcastStore";
import BroadcastActionButtons from "./BroadcastActionButtons";
import ConfirmModal from "@/components/common/ConfirmModal";
import { formatTime } from "@/utils/formatTime";
import useToastStore from "@/stores/toastStore";
import useMypageStore from "@/stores/mypageStore";
import useBroadcasts, { useDeleteBroadcast } from "@/hooks/useBroadcasts";
import EmptyMessage from "@/components/restaurant/EmptyMessage";

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

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => useToastStore.getState().addToast("삭제되었습니다.", "success"),
      onError: () => useToastStore.getState().addToast("삭제에 실패했습니다.", "error"),
    });
  };

  const { year: todayYear, month: todayMonth, date: todayDate } = getToday();

  return (
    <div>
      <div className="flex items-center justify-center mt-2">
        <button
          className="hover:cursor-pointer text-[25px] disabled:text-lightgray mr-5 outline-none"
          onClick={handleScrollLeft}
        >
          <MdKeyboardArrowLeft />
        </button>
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide pt-2"
          style={{ maxWidth: "calc(100% - 60px)" }}
          ref={tabRef}
        >
          {dateArray.map((d) => {
            const isToday =
              d === todayDate && month === todayMonth && year === todayYear;

            return (
              <div
                key={d}
                ref={(el) => {
                  if (el) itemRefs.current.set(d, el);
                  else itemRefs.current.delete(d);
                }}
                className={`flex flex-col justify-center items-center w-8 text-center flex-shrink-0 hover:cursor-pointer
                            ${
                              d === date
                                ? "text-primary5 font-semibold"
                                : "text-black"
                            }`}
                onClick={() => setDate(d)}
              >
                <div
                  className={`flex flex-col px-1 rounded h-[45px] ${
                    isToday ? "border border-primary5" : ""
                  }`}
                >
                  <p className="text-[14px] leading-tight mb-[1px]">
                    {getDay(year, month, d)}
                  </p>
                  <p className="text-[19px] leading-tight">{d}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="hover:cursor-pointer text-[25px] disabled:text-lightgray ml-5 outline-none"
          onClick={handleScrollRight}
        >
          <MdKeyboardArrowRight />
        </button>
      </div>

      <div className="mt-3 space-y-1 border-t">
        {broadcastsForSelectedDate.length > 0 ? (
          broadcastsForSelectedDate.map((b, index) => {
            return (
              <div
                key={`${b.broadcast_id}-${index}`}
                className="flex justify-between border-b"
              >
                <div className="p-3 flex flex-col text-[15px] w-0 flex-1">
                  <span className="font-semibold truncate">
                    [{b.league}] {formatTime(b.match_time)}
                  </span>
                  <span className="text-[16px] min-h-[18px] leading-[22px] block">
                    {b.team_one && b.team_two
                      ? `${b.team_one} vs ${b.team_two}`
                      : ""}
                  </span>
                  {b.etc && (
                    <span className="text-darkgray truncate">{b.etc}</span>
                  )}
                </div>
                <div className="p-3 flex text-[25px] gap-6 items-center shrink-0">
                  <BroadcastActionButtons
                    onEdit={() => {
                      setEditingId(b.broadcast_id);
                      setRestaurantSubpage("broadcast-edit");
                    }}
                    onDelete={() => setDeleteTargetId(b.broadcast_id)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <EmptyMessage message="중계 정보가 없습니다." />
        )}
      </div>
      {deleteTargetId !== null && (
        <ConfirmModal
          message="중계 일정을 삭제하시겠습니까?"
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
