import { FiMapPin } from "react-icons/fi";

const RestaurantDetailHeader = () => (
  <div className="h-14 flex items-center px-5 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <FiMapPin className="text-primary5 text-xl" />
      <span className="text-xl font-bold tracking-tight text-primary5">
        Playce
      </span>
    </div>
  </div>
);

export default RestaurantDetailHeader;
