import { memo } from "react";
import { FiHome, FiTv, FiImage } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import classNames from "classnames";

const TABS = ["홈", "중계", "메뉴", "사진"] as const;
type Tab = (typeof TABS)[number];

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  홈: <FiHome className="text-sm" />,
  메뉴: <FaUtensils className="text-sm" />,
  사진: <FiImage className="text-sm" />,
  중계: <FiTv className="text-sm" />,
};

interface RestaurantDetailTabsProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

const RestaurantDetailTabs = memo(function RestaurantDetailTabs({
  currentTab,
  setCurrentTab,
}: RestaurantDetailTabsProps) {
  return (
    <div className="flex bg-white sticky top-0 z-10 border-b border-gray-200">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={classNames(
            "flex-1 py-3 flex items-center justify-center gap-1.5 text-sm font-semibold transition-all relative",
            currentTab === tab
              ? "text-primary5"
              : "text-gray-400 hover:text-gray-600"
          )}
          onClick={() => setCurrentTab(tab)}
        >
          {TAB_ICONS[tab]}
          {tab}
          {/* 활성 인디케이터 */}
          {currentTab === tab && (
            <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-primary5 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
});

export default RestaurantDetailTabs;
