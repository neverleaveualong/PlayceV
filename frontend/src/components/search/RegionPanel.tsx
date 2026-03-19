import { useRegions } from "@/hooks/useRegions";
import { useRegionStore } from "@/stores/regionStore";
import { useState } from "react";
import { getUpdatedRegionSelection } from "@/utils/regionUtils";
import Tag from "@/components/common/Tag";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { FiMapPin } from "react-icons/fi";

const RegionPanel = () => {
  const [selectedBigRegionName, setSelectedBigRegionName] =
    useState<string>("");
  const { selectedRegions, toggleRegion, setSelectedRegions } =
    useRegionStore();

  const { bigRegions = [], bigRegionsLoading } = useRegions();
  const selectedBigRegionId = bigRegions.find(
    (r) => r.name === selectedBigRegionName
  )?.id;
  const { smallRegions = [] } = useRegions(selectedBigRegionId);

  const handleSmallRegionClick = (smallName: string) => {
    if (!selectedBigRegionName) return;
    const updated = getUpdatedRegionSelection(
      selectedRegions,
      selectedBigRegionName,
      smallName
    );
    setSelectedRegions(updated);
  };

  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden rounded-lg border border-gray-200 h-[55vh] md:h-[280px]">
        {/* 시/도 */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 border-r border-gray-200">
          {bigRegionsLoading ? (
            <LoadingSpinner />
          ) : (
            bigRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  setSelectedBigRegionName(region.name);
                  // 해당 시/도에 세부 선택이 없으면 자동으로 "전체" 추가
                  const hasSelection = selectedRegions.some(r => r.bigRegion === region.name);
                  if (!hasSelection) {
                    setSelectedRegions([
                      ...selectedRegions.filter(r => r.bigRegion !== region.name),
                      { bigRegion: region.name, smallRegion: "전체" },
                    ]);
                  }
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  region.name === selectedBigRegionName
                    ? "bg-white text-primary5 font-semibold border-r-2 border-primary5"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {region.name}
              </button>
            ))
          )}
        </div>

        {/* 구/군 */}
        <div className="w-1/2 overflow-y-auto">
          {selectedBigRegionName === "" ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <FiMapPin className="text-xl text-gray-300" />
              <p className="text-xs text-center">
                시/도를 선택하면
                <br />
                상세 지역이 표시됩니다
              </p>
            </div>
          ) : smallRegions.length === 0 ? (
            <LoadingSpinner />
          ) : (
            smallRegions.map((sub) => {
              const isChecked = selectedRegions.some(
                (r) =>
                  r.bigRegion === selectedBigRegionName &&
                  r.smallRegion === sub.name
              );

              return (
                <label
                  key={sub.id}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                    isChecked
                      ? "bg-primary4/50 text-primary5 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{sub.name}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-primary5 border-primary5"
                        : "border-gray-300"
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => handleSmallRegionClick(sub.name)}
                  />
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* 선택된 태그 */}
      {selectedRegions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3">
          {selectedRegions.map((r) => {
            const label =
              r.smallRegion === "전체"
                ? `${r.bigRegion} 전체`
                : `${r.bigRegion} ${r.smallRegion}`;

            return (
              <Tag
                key={`${r.bigRegion}-${r.smallRegion}`}
                label={label}
                onRemove={() => toggleRegion(r.bigRegion, r.smallRegion)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegionPanel;
