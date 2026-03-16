import { useCallback, useMemo } from "react";
import SearchResultItem from "./SearchResultItem";
import { useSearchStore } from "@/stores/searchStore";
import { sortSearchResults } from "@/utils/sortUtils";
import RestaurantDetailComponent from "@/components/restaurant/RestaurantDetail";
import useRestaurantDetail from "@/hooks/useRestaurantDetail";
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
  const { selectedStoreId, openDetail, closeDetail } = useRestaurantDetail();

  const handleSortByDistance = useCallback(() => setSort("distance"), [setSort]);
  const handleSortByDatetime = useCallback(() => setSort("datetime"), [setSort]);

  const sortedResults = useMemo(
    () => sortSearchResults(results, sort),
    [results, sort]
  );

  if (!hasSearched && !isSearching) return null;

  return (
    <div>
      <div className="flex justify-between border-b px-3 py-2 h-10">
        <p className="text-gray-600 leading-[1] flex items-center h-full">
          검색 결과
        </p>
        <div className="flex items-center gap-2 h-full">
          <button
            className={`text-sm px-2 leading-[1] h-full flex items-center ${
              sort === "distance" ? "text-primary5 font-bold" : "text-gray-400"
            }`}
            onClick={handleSortByDistance}
          >
            거리순
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button
            className={`text-sm px-2 leading-[1] h-full flex items-center ${
              sort === "datetime" ? "text-primary5 font-bold" : "text-gray-400"
            }`}
            onClick={handleSortByDatetime}
          >
            날짜순
          </button>
        </div>
      </div>

      <div className="">
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

      {/* 상세보기 모달/사이드바 */}
      {selectedStoreId !== null && (
        <RestaurantDetailComponent
          storeId={selectedStoreId}
          onClose={closeDetail}
        />
      )}
    </div>
  );
};

export default SearchResultList;
