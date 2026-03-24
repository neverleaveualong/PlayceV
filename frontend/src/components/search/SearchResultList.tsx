import { useCallback, useMemo, useState } from "react";
import SearchResultItem from "./SearchResultItem";
import { useSearchStore } from "@/stores/searchStore";
import { sortSearchResults } from "@/utils/sortUtils";
import type { SortOrder } from "@/utils/sortUtils";
import useMapStore from "@/stores/mapStore";
import type { SearchResultItem as SearchResultItemType } from "@/types/search";
import { ListSkeleton } from "@/components/common/Skeleton";
import EmptyMessage from "@/components/restaurant/EmptyMessage";
import { FiChevronUp, FiChevronDown, FiX } from "react-icons/fi";

const PAGE_SIZE = 20;

interface SearchResultListProps {
  results: SearchResultItemType[];
  isSearching: boolean;
  hasSearched: boolean;
  onClose: () => void;
}

const SearchResultList = ({
  results,
  isSearching,
  hasSearched,
  onClose,
}: SearchResultListProps) => {
  const sort = useSearchStore((state) => state.sort);
  const setSort = useSearchStore((state) => state.setSort);
  const openDetail = useMapStore((state) => state.openDetail);

  const [order, setOrder] = useState<SortOrder>("asc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleSort = useCallback((type: "distance" | "datetime") => {
    if (sort === type) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(type);
      setOrder("asc");
    }
    setVisibleCount(PAGE_SIZE);
  }, [sort, setSort]);

  const sortedResults = useMemo(
    () => sortSearchResults(results, sort, order),
    [results, sort, order]
  );

  const visibleResults = sortedResults.slice(0, visibleCount);
  const hasMore = visibleCount < sortedResults.length;

  if (!hasSearched && !isSearching) return null;

  const SortIcon = ({ active, currentOrder }: { active: boolean; currentOrder: SortOrder }) => {
    if (!active) return null;
    return currentOrder === "asc"
      ? <FiChevronUp className="text-xs" />
      : <FiChevronDown className="text-xs" />;
  };

  return (
    <div>
      {/* 헤더: 건수 + 정렬 + 닫기 */}
      <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <p className="text-sm font-medium text-gray-700 flex-1 min-w-0">
          검색 결과
          {!isSearching && sortedResults.length > 0 && (
            <span className="text-primary5 font-bold ml-1.5">{sortedResults.length}건</span>
          )}
        </p>
        <div className="flex items-center gap-1">
          <button
            className={`text-sm px-2.5 py-1 rounded-md transition-colors flex items-center gap-0.5 ${
              sort === "distance"
                ? "text-primary5 font-bold bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSort("distance")}
          >
            거리순
            <SortIcon active={sort === "distance"} currentOrder={order} />
          </button>
          <button
            className={`text-sm px-2.5 py-1 rounded-md transition-colors flex items-center gap-0.5 ${
              sort === "datetime"
                ? "text-primary5 font-bold bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSort("datetime")}
          >
            날짜순
            <SortIcon active={sort === "datetime"} currentOrder={order} />
          </button>
          <button
            onClick={onClose}
            className="ml-1 w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="검색 결과 닫기"
          >
            <FiX className="text-sm" />
          </button>
        </div>
      </div>

      {/* 결과 목록 */}
      <div>
        {isSearching ? (
          <div className="py-4"><ListSkeleton count={4} /></div>
        ) : sortedResults.length === 0 ? (
          <EmptyMessage message="검색 결과가 없습니다." />
        ) : (
          <>
            {visibleResults.map((item, index) => {
              const date = item.broadcast
                ? new Date(item.broadcast.match_date)
                : null;

              const matchInfo =
                date && item.broadcast
                  ? item.broadcast.team_one && item.broadcast.team_two
                    ? `${date.getMonth() + 1}/${date.getDate()} · ${
                        item.broadcast.team_one
                      } vs ${item.broadcast.team_two}`
                    : `${date.getMonth() + 1}/${date.getDate()} · ${
                        item.broadcast.league
                      }`
                  : "";

              const displayItem = {
                storeName: item.store_name,
                address: item.address,
                distance: item.distance,
                matchInfo,
                imgUrl: item.img_url || "/noimg.png",
                rank: index + 1,
              };

              return (
                <SearchResultItem
                  key={item.id}
                  data={displayItem}
                  onClick={() => openDetail(item.id)}
                />
              );
            })}

            {/* 더보기 / 페이지 정보 */}
            <div className="px-4 py-3 border-t border-gray-100">
              {hasMore ? (
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="w-full py-2.5 text-sm font-medium text-primary5 bg-primary4/30 hover:bg-primary4/50 rounded-xl transition-colors"
                >
                  더보기 ({visibleCount}/{sortedResults.length})
                </button>
              ) : (
                <p className="text-xs text-center text-gray-400">
                  전체 {sortedResults.length}건을 모두 확인했습니다
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultList;
