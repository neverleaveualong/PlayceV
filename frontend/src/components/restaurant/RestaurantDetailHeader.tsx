import { FiMapPin, FiX } from "react-icons/fi";

interface RestaurantDetailHeaderProps {
  onClose: () => void;
}

const RestaurantDetailHeader = ({ onClose }: RestaurantDetailHeaderProps) => (
  <div className="h-14 flex items-center justify-between px-5 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <FiMapPin className="text-primary5 text-xl" />
      <span className="text-xl font-bold tracking-tight text-primary5">
        Playce
      </span>
    </div>
    <button
      onClick={onClose}
      className="p-1.5 rounded-lg hover:bg-gray-100 transition"
      aria-label="상세보기 닫기"
    >
      <FiX className="text-gray-500 text-xl" />
    </button>
  </div>
);

export default RestaurantDetailHeader;
