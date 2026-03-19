import { FaUserEdit, FaStore, FaTv, FaTimes } from "react-icons/fa";
import useMypageStore from "@/stores/mypageStore";
import useBroadcastStore from "@/stores/broadcastStore";

interface MobileTabBarProps {
  selected: "profile" | "restaurant" | "broadcast";
  onSelect: (tab: "profile" | "restaurant" | "broadcast") => void;
  onClose: () => void;
}

const tabs = [
  { key: "profile" as const, icon: <FaUserEdit />, label: "내 정보" },
  { key: "restaurant" as const, icon: <FaStore />, label: "식당" },
  { key: "broadcast" as const, icon: <FaTv />, label: "중계" },
];

const MobileTabBar = ({ selected, onSelect, onClose }: MobileTabBarProps) => {
  const { setRestaurantSubpage } = useMypageStore();
  const { resetYMD } = useBroadcastStore();

  const handleSelect = (key: "profile" | "restaurant" | "broadcast") => {
    onSelect(key);
    setRestaurantSubpage("restaurant-home");
    if (key === "profile" || key === "broadcast") resetYMD();
  };

  return (
    <div className="flex items-center bg-primary4 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleSelect(tab.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold transition-colors ${
            selected === tab.key
              ? "text-primary5 bg-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="text-sm">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
      <button
        onClick={onClose}
        className="px-4 py-3.5 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="닫기"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  );
};

export default MobileTabBar;
