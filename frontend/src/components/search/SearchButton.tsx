import { SearchOutlined } from "@ant-design/icons";
import { useSearchStore } from "@/stores/searchStore";
import { useRegionStore } from "@/stores/regionStore";
import { useSportStore } from "@/stores/sportStore";
import Button from "@/components/common/Button";
import useToastStore from "@/stores/toastStore";

const SearchButton = () => {
  const {
    searchText,
    setBigRegions,
    setSmallRegions,
    setSports,
    setLeagues,
    setSubmittedParams,
  } = useSearchStore();
  const { selectedRegions } = useRegionStore();
  const { sport, selectedLeagues } = useSportStore();

  const { addToast } = useToastStore();
  const handleSearch = () => {
    const hasKeyword =
      searchText.trim() !== "" ||
      selectedRegions.length > 0 ||
      sport !== "" ||
      selectedLeagues.length > 0;

    if (!hasKeyword) {
      addToast("검색 조건을 하나 이상 입력해주세요.", "info");
      return;
    }

    let bigRegions: string[] = [];
    let smallRegions: string[] = [];
    if (selectedRegions.length > 0) {
      bigRegions = [...new Set(selectedRegions.map((r) => r.bigRegion))];
      smallRegions = selectedRegions.map((r) => r.smallRegion);
    }
    setBigRegions(bigRegions);
    setSmallRegions(smallRegions);

    const uniqueSports = [...new Set(selectedLeagues.map((l) => l.sport))];
    setSports(uniqueSports);

    const leagues = selectedLeagues.map((l) => l.league);
    setLeagues(leagues);

    setSubmittedParams({
      searchText,
      sports: uniqueSports,
      leagues,
      bigRegions,
      smallRegions,
      sort: useSearchStore.getState().sort,
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
