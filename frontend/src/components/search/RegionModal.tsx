import { useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import RegionPanel from "./RegionPanel";
import { useRegionStore } from "@/stores/regionStore";
import Button from "@/components/common/Button";
import type { SelectedRegion } from "@/types/staticdata";

interface RegionModalProps {
  onClose: () => void;
  onApply: (selected: string[]) => void;
}

const RegionModal = ({ onClose, onApply }: RegionModalProps) => {
  const { selectedRegions, resetRegions, setSelectedRegions } = useRegionStore();
  const savedRegions = useRef<SelectedRegion[]>(selectedRegions);

  const regionLabels = selectedRegions.map(
    (r) => `${r.bigRegion} ${r.smallRegion}`
  );

  const handleClose = () => {
    setSelectedRegions(savedRegions.current);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[95vw] md:w-[600px] max-h-[90vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-mainText">지역</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* 패널 */}
        <RegionPanel />

        {/* 버튼 */}
        <div className="border-t border-gray-200 pt-4 mt-1 flex gap-3">
          <Button scheme="reset" onClick={resetRegions}>
            초기화
          </Button>
          <Button
            scheme="apply"
            className="flex-1"
            onClick={() => {
              onApply(regionLabels);
              onClose();
            }}
          >
            적용
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RegionModal;
