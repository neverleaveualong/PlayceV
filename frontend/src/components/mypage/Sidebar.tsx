import type { ReactNode } from "react";
import { FaUserEdit, FaStore, FaTv } from "react-icons/fa";
import useMypageStore from "@/stores/mypageStore";
import useBroadcastStore from "@/stores/broadcastStore";

interface SidebarProps {
  selected: "profile" | "restaurant" | "broadcast";
  onSelect: (tab: "profile" | "restaurant" | "broadcast") => void;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-sm font-medium
        transition-all duration-150
        ${
          active
            ? "bg-white text-primary5 shadow-sm"
            : "text-gray-600 hover:bg-primary3/40"
        }`}
    >
      <span className="text-base flex-shrink-0 w-5 flex items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

const Sidebar = ({ selected, onSelect }: SidebarProps) => {
  const { setRestaurantSubpage } = useMypageStore();
  const { resetYMD } = useBroadcastStore();
  return (
    <div className="w-full h-full bg-primary4 px-3 py-6 flex flex-col">
      <nav className="flex flex-col gap-1">
        <SidebarItem
          icon={<FaUserEdit />}
          label="내 정보"
          active={selected === "profile"}
          onClick={() => {
            onSelect("profile");
            setRestaurantSubpage("restaurant-home");
            resetYMD();
          }}
        />
        <SidebarItem
          icon={<FaStore />}
          label="식당 관리"
          active={selected === "restaurant"}
          onClick={() => {
            onSelect("restaurant");
            setRestaurantSubpage("restaurant-home");
          }}
        />
        <SidebarItem
          icon={<FaTv />}
          label="중계 관리"
          active={selected === "broadcast"}
          onClick={() => {
            onSelect("broadcast");
            setRestaurantSubpage("restaurant-home");
            resetYMD();
          }}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
