import { useMemo, useState, useEffect } from "react";
import { FiTv, FiChevronDown } from "react-icons/fi";
import useMapStore from "@/stores/mapStore";
import useNearbyRestaurants from "@/hooks/useNearbyRestaurants";
import { getToday } from "@/utils/dateUtils";

interface TodayBroadcastBarProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function TodayBroadcastBar({ expanded, onToggle }: TodayBroadcastBarProps) {
  const bounds = useMapStore((state) => state.bounds);
  const { data: restaurants = [] } = useNearbyRestaurants(bounds);
  const { dateString: today } = getToday();

  // 1분마다 갱신해서 LIVE 상태 정확하게 반영
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const count = useMemo(() => {
    let total = 0;
    for (const store of restaurants) {
      for (const b of store.broadcasts || []) {
        if (b.match_date === today) total++;
      }
    }
    return total;
  }, [restaurants, today]);

  const liveCount = useMemo(() => {
    let live = 0;
    for (const store of restaurants) {
      for (const b of store.broadcasts || []) {
        if (b.match_date !== today) continue;
        const [h, m] = b.match_time.split(":").map(Number);
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        if (now >= start && now <= end) live++;
      }
    }
    return live;
  }, [restaurants, today, now]);

  if (count === 0) return null;

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        <FiTv className="text-primary5 text-sm" />
        <span className="text-xs font-semibold text-gray-700">
          오늘의 중계
        </span>
        <span className="text-[10px] bg-primary4/60 text-primary5 rounded-full px-1.5 py-0.5 font-bold">
          {count}경기
        </span>
        {liveCount > 0 && (
          <span className="inline-flex items-center gap-0.5 text-[9px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            LIVE {liveCount}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-gray-400">
        <FiChevronDown className={`text-xs transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>
    </button>
  );
}
