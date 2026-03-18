import { FiMapPin, FiArrowLeft } from "react-icons/fi";

interface RestaurantDetailHeaderProps {
  onClose: () => void;
}

const RestaurantDetailHeader = ({ onClose }: RestaurantDetailHeaderProps) => (
  <div className="h-14 flex items-center px-4 border-b border-gray-100">
    <button
      onClick={onClose}
      className="p-1.5 rounded-lg hover:bg-gray-100 transition mr-2"
      aria-label="상세보기 닫기"
    >
      <FiArrowLeft className="text-gray-600 text-xl" />
    </button>
    <FiMapPin className="text-primary5 text-xl" />
    <span className="text-xl font-bold tracking-tight text-primary5 ml-2">
      Playce
    </span>
  </div>
);

export default RestaurantDetailHeader;
