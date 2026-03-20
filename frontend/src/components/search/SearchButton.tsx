import { useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchStore } from "@/stores/searchStore";
import { useRegionStore } from "@/stores/regionStore";
import { useSportStore } from "@/stores/sportStore";
import Button from "@/components/common/Button";
import useToastStore from "@/stores/toastStore";
import useRecentSearches from "@/hooks/useRecentSearches";

const SearchButton = () => {
  const searchText = useSearchStore((state) => state.searchText);
  const setBigRegions = useSearchStore((state) => state.setBigRegions);
  const setSmallRegions = useSearchStore((state) => state.setSmallRegions);
  const setSports = useSearchStore((state) => state.setSports);
  const setLeagues = useSearchStore((state) => state.setLeagues);
  const setSubmittedParams = useSearchStore((state) => state.setSubmittedParams);
  const selectedRegions = useRegionStore((state) => state.selectedRegions);
  const sport = useSportStore((state) => state.sport);
  const selectedLeagues = useSportStore((state) => state.selectedLeagues);

  const addToast = useToastStore((state) => state.addToast);
  const { addSearch } = useRecentSearches();

  const bigRegions = useMemo(
    () =>
      selectedRegions.length > 0
        ? [...new Set(selectedRegions.map((r) => r.bigRegion))]
        : [],
    [selectedRegions]
  );

  const uniqueSports = useMemo(
    () => [...new Set(selectedLeagues.map((l) => l.sport))],
    [selectedLeagues]
  );

  const handleSearch = () => {
    const { dateFrom, dateTo } = useSearchStore.getState();
    const hasKeyword =
      searchText.trim() !== "" ||
      selectedRegions.length > 0 ||
      sport !== "" ||
      selectedLeagues.length > 0 ||
      dateFrom !== "" ||
      dateTo !== "";

    if (!hasKeyword) {
      addToast("검색 조건을 하나 이상 입력해주세요.", "info");
      return;
    }

    const smallRegions = selectedRegions.map((r) => r.smallRegion);
    setBigRegions(bigRegions);
    setSmallRegions(smallRegions);

    setSports(uniqueSports);

    const leagues = selectedLeagues.map((l) => l.league);
    setLeagues(leagues);

    if (searchText.trim()) addSearch(searchText.trim());

    const { sort } = useSearchStore.getState();
    setSubmittedParams({
      searchText,
      sports: uniqueSports,
      leagues,
      bigRegions,
      smallRegions,
      dateFrom,
      dateTo,
      sort,
    });
  };

  return (
    <Button onClick={handleSearch} scheme="apply" fullWidth size="semi">
      <SearchOutlined className="text-sm mr-2" />
      검색
    </Button>
  );
};

export default SearchButton;
