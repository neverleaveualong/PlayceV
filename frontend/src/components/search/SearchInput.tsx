import { useState, useRef, useEffect } from "react";
import { FiClock, FiX } from "react-icons/fi";
import { useSearchStore } from "@/stores/searchStore";
import useRecentSearches from "@/hooks/useRecentSearches";
import InputText from "@/components/common/InputText";

interface SearchInputProps {
  className?: string;
}

const SearchInput = ({ className }: SearchInputProps) => {
  const { searchText, setSearchText } = useSearchStore();
  const { searches, removeSearch, clearAll } = useRecentSearches();
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showDropdown = isFocused && !searchText && searches.length > 0;

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    if (isFocused) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isFocused]);

  const handleSelect = (keyword: string) => {
    setSearchText(keyword);
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className || ""}`} ref={wrapperRef}>
      <InputText
        placeholder="가게 이름으로 검색 (선택)"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
            <span className="text-[11px] text-gray-400 font-medium">최근 검색어</span>
            <button
              onClick={clearAll}
              className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              전체 삭제
            </button>
          </div>

          <ul>
            {searches.map((keyword) => (
              <li key={keyword} className="group">
                <button
                  onClick={() => handleSelect(keyword)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiClock className="text-gray-300 text-xs flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{keyword}</span>
                  <span
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(keyword);
                    }}
                    className="p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all"
                  >
                    <FiX className="text-gray-400 text-xs" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
