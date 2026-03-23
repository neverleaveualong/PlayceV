import { useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import Button from "@/components/common/Button";
import SportPanel from "./SportPanel";
import { useSportStore } from "@/stores/sportStore";
import type { SelectedSports } from "@/types/staticdata";

interface SportModalProps {
  onClose: () => void;
  onApply: (selected: { sport: string; leagues: string[] }) => void;
}

const SportModal = ({ onClose, onApply }: SportModalProps) => {
  const { sport, selectedLeagues, resetSport, setSport, setSelectedLeagues } = useSportStore();
  const savedSport = useRef(sport);
  const savedLeagues = useRef<SelectedSports[]>(selectedLeagues);

  const handleClose = () => {
    setSport(savedSport.current);
    setSelectedLeagues(savedLeagues.current);
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
          <h2 className="text-lg font-bold text-mainText">경기</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* 패널 */}
        <SportPanel />

        {/* 버튼 */}
        <div className="border-t border-gray-200 pt-4 mt-1 flex gap-3">
          <Button onClick={resetSport} scheme="reset">
            초기화
          </Button>
          <Button
            onClick={() => {
              onApply({
                sport,
                leagues: selectedLeagues
                  .filter((r) => r.sport === sport)
                  .map((r) => r.league),
              });
              onClose();
            }}
            scheme="apply"
            className="flex-1"
          >
            적용
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SportModal;
