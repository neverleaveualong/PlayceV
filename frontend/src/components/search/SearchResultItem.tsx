import { memo } from "react";
import type { FC } from "react";
import FallbackImage from "@/components/common/FallbackImage";
import { FiMapPin } from "react-icons/fi";

interface SearchResultItemProps {
  data: {
    storeName: string;
    address: string;
    distance?: number | undefined;
    matchInfo: string;
    imgUrl: string;
    rank?: number;
  };
  onClick?: () => void;
}

const SearchResultItem: FC<SearchResultItemProps> = memo(function SearchResultItem({ data, onClick }) {
  const { storeName, address, distance, matchInfo, imgUrl, rank } = data;

  return (
    <div
      role="button"
      tabIndex={0}
      className="group w-full hover:bg-primary4/20 transition-all cursor-pointer border-b border-gray-100 focus:outline-none focus:bg-primary3/20"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
    >
      <div className="flex gap-3.5 px-4 py-3.5">
        {/* 이미지 */}
        <FallbackImage
          src={imgUrl}
          alt={`${storeName} 썸네일`}
          className="w-[72px] h-[72px] object-cover rounded-xl flex-shrink-0 bg-gray-100"
        />

        {/* 텍스트 */}
        <div className="flex flex-col justify-center min-w-0 flex-1 gap-1">
          <div className="flex items-center gap-2">
            {rank && (
              <span className="text-[11px] font-bold text-primary5 bg-primary4/60 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                {rank}
              </span>
            )}
            <h3 className="text-[15px] font-bold text-mainText truncate">
              {storeName}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-darkgray">
            {distance != null && (
              <>
                <span className="font-medium text-primary5">{distance.toFixed(1)}km</span>
                <span className="text-gray-300">|</span>
              </>
            )}
            <FiMapPin className="text-[10px] text-gray-400 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>

          {matchInfo && (
            <p className="text-xs font-medium text-primary5 truncate mt-0.5">
              {matchInfo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default SearchResultItem;
