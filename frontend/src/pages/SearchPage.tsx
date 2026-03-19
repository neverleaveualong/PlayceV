import { useState, useMemo, useRef, useEffect } from "react";
import { FiChevronDown, FiSearch, FiStar, FiCalendar } from "react-icons/fi";
import RegionModal from "@/components/search/RegionModal";
import { useRegionStore } from "@/stores/regionStore";
import SportModal from "@/components/search/SportModal";
import { useSportStore } from "@/stores/sportStore";
import SearchInput from "@/components/search/SearchInput";
import SearchButton from "@/components/search/SearchButton";
import SearchResultList from "@/components/search/SearchResultList";
import AppHeader from "@/components/layout/AppHeader";
import TodayBroadcastSidebar from "@/components/broadcast/TodayBroadcastSidebar";
import TodayBroadcastBar from "@/components/broadcast/TodayBroadcastBar";
import FavoriteSidebar from "@/components/mypage/FavoriteSidebar";
import { useSearchStore } from "@/stores/searchStore";
import ResetButton from "@/components/search/ResetButton";
import { useSearchResults } from "@/hooks/useSearchResults";

type SidebarTab = "search" | "favorites";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>("search");
  const [showRegionModal, setShowRegionModal] = useState(false);
  const { selectedRegions } = useRegionStore();
  const { submittedParams } = useSearchStore();

  const { dateFrom, dateTo, setDateFrom, setDateTo } = useSearchStore();

  const { data: results, isLoading: isSearching } = useSearchResults(
    submittedParams ?? {
      searchText: "",
      sports: [],
      leagues: [],
      bigRegions: [],
      smallRegions: [],
      dateFrom: "",
      dateTo: "",
      sort: "distance",
    },
    submittedParams !== null
  );

  // 날짜 프리셋
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const getWeekend = () => {
    const d = new Date();
    const day = d.getDay();
    const satOffset = day === 0 ? -1 : 6 - day;
    const sat = new Date(d);
    sat.setDate(d.getDate() + satOffset);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return { from: sat.toISOString().slice(0, 10), to: sun.toISOString().slice(0, 10) };
  };

  const handleDatePreset = (preset: "today" | "weekend" | "week" | "clear") => {
    if (preset === "today") {
      setDateFrom(today);
      setDateTo(today);
    } else if (preset === "weekend") {
      const { from, to } = getWeekend();
      setDateFrom(from);
      setDateTo(to);
    } else if (preset === "week") {
      const to = new Date();
      to.setDate(to.getDate() + 7);
      setDateFrom(today);
      setDateTo(to.toISOString().slice(0, 10));
    } else {
      setDateFrom("");
      setDateTo("");
    }
  };

  const activeDatePreset = dateFrom === today && dateTo === today
    ? "today"
    : dateFrom && dateTo && dateFrom === getWeekend().from && dateTo === getWeekend().to
    ? "weekend"
    : dateFrom === today && dateTo
    ? "week"
    : "";

  const hasSearched = submittedParams !== null;
  const [broadcastExpanded, setBroadcastExpanded] = useState(false);

  // 검색할 때마다 중계 요약바를 접어서 검색 결과 먼저 보이게
  useEffect(() => {
    if (hasSearched) setBroadcastExpanded(false);
  }, [submittedParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedRegionLabel =
    selectedRegions.length === 0
      ? "지역"
      : selectedRegions.length === 1
      ? `${selectedRegions[0].bigRegion} ${selectedRegions[0].smallRegion}`
      : `${selectedRegions[0].bigRegion} ${selectedRegions[0].smallRegion} 외 ${
          selectedRegions.length - 1
        }곳`;

  const [showSportModal, setShowSportModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // 날짜 라벨
  const dateLabel = !dateFrom && !dateTo
    ? "날짜"
    : activeDatePreset === "today" ? "오늘"
    : activeDatePreset === "weekend" ? "주말"
    : activeDatePreset === "week" ? "이번 주"
    : `${dateFrom?.slice(5)} ~ ${dateTo?.slice(5)}`;

  // 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDatePicker]);
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
    <div className="h-screen bg-white w-full md:w-sidebar">
      <aside
        className="w-full md:w-sidebar h-screen overflow-y-auto border-r bg-white"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* 앱 이름/로고 */}
        <AppHeader />

        {/* 탭 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              activeTab === "search"
                ? "text-primary5 border-b-2 border-primary5"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <FiSearch className="text-base" />
            검색
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              activeTab === "favorites"
                ? "text-primary5 border-b-2 border-primary5"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <FiStar className="text-base" />
            즐겨찾기
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "search" ? (
          <>
            {/* 검색 영역 */}
            <div className="px-4 py-4 space-y-3 border-b border-gray-100">
              <p className="text-xs text-darkgray">
                보고 싶은 경기를 선택하면 중계 가게를 찾아드려요
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSportModal(true)}
                  className={`flex-1 flex items-center justify-between px-3.5 py-2.5 border rounded-xl text-sm transition-colors min-w-0 ${
                    selectedLeagues.length > 0
                      ? "border-primary5 bg-primary4/20 text-primary5 font-medium"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-primary5 hover:bg-white"
                  }`}
                >
                  <span className="truncate" title={selectedSportLabel}>
                    {selectedSportLabel}
                  </span>
                  <FiChevronDown className={`w-3.5 h-3.5 ml-1 flex-shrink-0 ${selectedLeagues.length > 0 ? "text-primary5" : "text-gray-400"}`} />
                </button>
                <button
                  onClick={() => setShowRegionModal(true)}
                  className={`flex-1 flex items-center justify-between px-3.5 py-2.5 border rounded-xl text-sm transition-colors min-w-0 ${
                    selectedRegions.length > 0
                      ? "border-primary5 bg-primary4/20 text-primary5 font-medium"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-primary5 hover:bg-white"
                  }`}
                >
                  <span className="truncate" title={selectedRegionLabel}>
                    {selectedRegionLabel}
                  </span>
                  <FiChevronDown className={`w-3.5 h-3.5 ml-1 flex-shrink-0 ${selectedRegions.length > 0 ? "text-primary5" : "text-gray-400"}`} />
                </button>
              </div>

              {/* 날짜 필터 — 드롭다운 스타일 */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 border rounded-xl text-sm transition-colors min-w-0 ${
                    dateFrom || dateTo
                      ? "border-primary5 bg-primary4/20 text-primary5 font-medium"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-primary5 hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-sm flex-shrink-0" />
                    <span className="truncate">{dateLabel}</span>
                  </span>
                  <FiChevronDown className={`w-3.5 h-3.5 ml-1 flex-shrink-0 transition-transform ${showDatePicker ? "rotate-180" : ""} ${dateFrom ? "text-primary5" : "text-gray-400"}`} />
                </button>

                {showDatePicker && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-3 space-y-3 animate-slide-up">
                    {/* 프리셋 */}
                    <div className="flex gap-1.5">
                      {(
                        [
                          ["today", "오늘"],
                          ["weekend", "주말"],
                          ["week", "이번 주"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => handleDatePreset(activeDatePreset === key ? "clear" : key)}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                            activeDatePreset === key
                              ? "bg-primary5 text-white border-primary5"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary5 hover:text-primary5"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* 직접 선택 */}
                    <div className="border-t border-gray-100 pt-2.5">
                      <p className="text-[11px] text-gray-400 mb-1.5">직접 선택</p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => { setDateFrom(e.target.value); }}
                          className="flex-1 px-2.5 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 bg-gray-50 focus:border-primary5 focus:outline-none"
                        />
                        <span className="text-xs text-gray-400">~</span>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => { setDateTo(e.target.value); }}
                          className="flex-1 px-2.5 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 bg-gray-50 focus:border-primary5 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 초기화 + 적용 */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { handleDatePreset("clear"); }}
                        className="py-2 px-4 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        초기화
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="flex-1 py-2 text-xs text-white bg-primary5 rounded-lg hover:brightness-95 transition-colors font-medium"
                      >
                        적용
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <SearchInput className="w-full" />
              {showRegionModal && (
                <RegionModal
                  onClose={() => setShowRegionModal(false)}
                  onApply={() => setShowRegionModal(false)}
                />
              )}
              {showSportModal && (
                <SportModal
                  onClose={() => setShowSportModal(false)}
                  onApply={() => setShowSportModal(false)}
                />
              )}
              <div className="flex gap-2">
                <div className="flex-1">
                  <SearchButton />
                </div>
                <div className="w-20">
                  <ResetButton />
                </div>
              </div>
            </div>
            {hasSearched ? (
              <>
                <TodayBroadcastBar
                  expanded={broadcastExpanded}
                  onToggle={() => setBroadcastExpanded((prev) => !prev)}
                />
                {broadcastExpanded && (
                  <div className="px-4 py-4 border-b border-gray-100">
                    <TodayBroadcastSidebar hideHeader />
                  </div>
                )}
                <div className="mt-4 px-3">
                  <SearchResultList
                    results={results ?? []}
                    isSearching={isSearching}
                    hasSearched={hasSearched}
                  />
                </div>
              </>
            ) : (
              <div className="px-4 py-4">
                <TodayBroadcastSidebar />
              </div>
            )}
          </>
        ) : (
          <FavoriteSidebar />
        )}
      </aside>
    </div>
  );
};

export default SearchPage;
