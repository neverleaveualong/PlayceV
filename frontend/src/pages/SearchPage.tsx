import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import RegionModal from "@/components/search/RegionModal";
import { useRegionStore } from "@/stores/regionStore";
import SportModal from "@/components/search/SportModal";
import { useSportStore } from "@/stores/sportStore";
import SearchInput from "@/components/search/SearchInput";
import SearchButton from "@/components/search/SearchButton";
import SearchResultList from "@/components/search/SearchResultList";
import AppHeader from "@/components/layout/AppHeader";
import FavoriteSidebar from "@/components/mypage/FavoriteSidebar";
import TodayBroadcastSidebar from "@/components/broadcast/TodayBroadcastSidebar";
import { useSearchStore } from "@/stores/searchStore";
import ResetButton from "@/components/search/ResetButton";
import { useSearchResults } from "@/hooks/useSearchResults";

const SearchPage = () => {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const { selectedRegions } = useRegionStore();
  const { submittedParams } = useSearchStore();

  const { data: results, isLoading: isSearching } = useSearchResults(
    submittedParams ?? {
      searchText: "",
      sports: [],
      leagues: [],
      bigRegions: [],
      smallRegions: [],
      sort: "distance",
    },
    submittedParams !== null
  );

  const hasSearched = submittedParams !== null;

  const selectedRegionLabel =
    selectedRegions.length === 0
      ? "지역"
      : selectedRegions.length === 1
      ? `${selectedRegions[0].bigRegion} ${selectedRegions[0].smallRegion}`
      : `${selectedRegions[0].bigRegion} ${selectedRegions[0].smallRegion} 외 ${
          selectedRegions.length - 1
        }곳`;

  const [showSportModal, setShowSportModal] = useState(false);
  const { sport, selectedLeagues } = useSportStore();

  const selectedSportLabel = !sport
    ? "경기"
    : selectedLeagues.length === 0
    ? `${sport}`
    : selectedLeagues.length === 1
    ? `${sport} ${selectedLeagues[0].league}`
    : `${sport} ${selectedLeagues[0].league} 외 ${
        selectedLeagues.length - 1
      }개`;

  return (
    <div className="h-screen bg-white">
      {/* 사이드바 */}
      <aside
        className="w-[430px] h-screen overflow-y-auto border-r bg-white"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE, Edge
        }}
      >
        {/* 앱 이름/로고 */}
        <AppHeader />

        {/* 검색 영역 */}
        <div className="bg-primary4 px-3 py-3 space-y-2">
          {/* 입력창 */}
          <div>
            <SearchInput className="w-full" />
          </div>

          {/* 지역 검색 버튼 */}
          <div>
            <button
              onClick={() => setShowRegionModal(true)}
              className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white text-gray-700 text-sm shadow-sm hover:border-primary1 min-w-0"
            >
              <span
                className="truncate block text-left min-w-0"
                title={selectedRegionLabel}
              >
                {selectedRegionLabel}
              </span>
              <FiChevronDown className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
            </button>
            {showRegionModal && (
              <RegionModal
                onClose={() => setShowRegionModal(false)}
                onApply={() => {
                  setShowRegionModal(false);
                }}
              />
            )}
          </div>

          {/* 경기 검색 버튼 */}
          <div>
            <button
              onClick={() => setShowSportModal(true)}
              className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white text-gray-700 text-sm shadow-sm hover:border-primary1 min-w-0"
            >
              <span
                className="truncate block text-left min-w-0"
                title={selectedSportLabel}
              >
                {selectedSportLabel}
              </span>
              <FiChevronDown className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
            </button>
            {showSportModal && (
              <SportModal
                onClose={() => setShowSportModal(false)}
                onApply={() => {
                  setShowSportModal(false);
                }}
              />
            )}
          </div>

          {/* 검색 버튼 */}
          <div className="flex gap-2">
            <div className="flex-[7]">
              <SearchButton />
            </div>
            <div className="flex-[3]">
              <ResetButton />
            </div>
          </div>
        </div>
        {hasSearched || isSearching ? (
          <div className="mt-4 px-3">
            <SearchResultList
              results={results ?? []}
              isSearching={isSearching}
              hasSearched={hasSearched}
            />
          </div>
        ) : (
          <>
            <FavoriteSidebar />
            <TodayBroadcastSidebar />
          </>
        )}
      </aside>
    </div>
  );
};

export default SearchPage;
