import { memo } from "react";
import type { FC } from "react";
import FallbackImage from "@/components/common/FallbackImage";

interface SearchResultItemProps {
  data: {
    storeName: string;
    address: string;
    distance?: number | undefined;
    matchInfo: string;
    imgUrl: string;
  };
  onClick?: () => void;
}

const SearchResultItem: FC<SearchResultItemProps> = memo(function SearchResultItem({ data, onClick }) {
  const { storeName, address, distance, matchInfo, imgUrl } = data;

  return (
    <div
      role="button"
      tabIndex={0}
      className="w-full hover:bg-primary3/30 transition-colors cursor-pointer border-b border-gray-200 focus:outline-none focus:bg-primary3/20"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
    >
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex flex-col leading-tight min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-[2px] truncate">
            {storeName}
          </h3>
          {distance != null && (
            <p className="text-sm text-gray-500 mb-[1px]">
              {distance.toFixed(1)}km
            </p>
          )}

          <p className="text-sm text-gray-600 mb-[1px]">{address}</p>
          <p className="text-sm text-primary5 mt-1.5 min-h-[20px]">
            {matchInfo || ""}
          </p>
        </div>

        <FallbackImage
          src={imgUrl}
          alt={`${storeName} 썸네일`}
          className="w-20 h-20 object-cover rounded-lg ml-4 flex-shrink-0"
        />
      </div>
    </div>
  );
});

export default SearchResultItem;
