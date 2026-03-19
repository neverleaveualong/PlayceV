import { useSearchStore } from "@/stores/searchStore";
import InputText from "@/components/common/InputText";

interface SearchInputProps {
  className?: string;
}

const SearchInput = ({ className }: SearchInputProps) => {
  const { searchText, setSearchText } = useSearchStore();

  return (
    <div className={`flex gap-2 ${className || ""}`}>
      <InputText
        placeholder="가게 이름으로 검색 (선택)"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
