import { useCallback, useMemo } from "react";
import SearchResultItem from "./SearchResultItem";
import { useSearchStore } from "@/stores/searchStore";
import { sortSearchResults } from "@/utils/sortUtils";
import useMapStore from "@/stores/mapStore";
import type { SearchResultItem as SearchResultItemType } from "@/types/search";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyMessage from "@/components/restaurant/EmptyMessage";

interface SearchResultListProps {
  results: SearchResultItemType[];
  isSearching: boolean;
  hasSearched: boolean;
}

const SearchResultList = ({
  results,
  isSearching,
  hasSearched,
}: SearchResultListProps) => {
  const sort = useSearchStore((state) => state.sort);
  const setSort = useSearchStore((state) => state.setSort);
  const openDetail = useMapStore((state) => state.openDetail);

  const handleSortByDistance = useCallback(() => setSort("distance"), [setSort]);
  const handleSortByDatetime = useCallback(() => setSort("datetime"), [setSort]);

  const sortedResults = useMemo(
    () => sortSearchResults(results, sort),
    [results, sort]
  );

  if (!hasSearched && !isSearching) return null;

  return (
    <div>
      <div className="flex justify-between border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <p className="text-sm font-medium text-gray-700 flex items-center">
          검색 결과
        </p>
        <div className="flex items-center gap-1">
          <button
            className={`text-sm px-2.5 py-1 rounded-md transition-colors ${
              sort === "distance"
                ? "text-primary5 font-bold bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            onClick={handleSortByDistance}
          >
            거리순
          </button>
          <button
            className={`text-sm px-2.5 py-1 rounded-md transition-colors ${
              sort === "datetime"
                ? "text-primary5 font-bold bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            onClick={handleSortByDatetime}
          >
            날짜순
          </button>
        </div>
      </div>

      <div>
        {isSearching ? (
          <div className="py-12"><LoadingSpinner message="검색 중..." /></div>
        ) : sortedResults.length === 0 ? (
          <EmptyMessage message="검색 결과가 없습니다." />
        ) : (
          sortedResults.map((item) => {
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
            };

            return (
              <SearchResultItem
                key={item.id}
                data={displayItem}
                onClick={() => {
                  openDetail(item.id);
                }}
              />
            );
          })
        )}
      </div>

    </div>
  );
};

export default SearchResultList;
