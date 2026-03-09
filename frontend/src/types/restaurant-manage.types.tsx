import BroadcastView from "@/components/broadcast/BroadcastView";
import RestaurantEdit from "@/components/mypage/restaurant-manage/RestaurantEdit";
import RestaurantHome from "@/components/mypage/restaurant-manage/RestaurantHome";
import RestaurantRegister from "@/components/mypage/restaurant-manage/RestaurantRegister";

export const menuItems = [
  {
    key: "restaurant-home",
    label: "식당 관리",
    component: () => <RestaurantHome />,
  },
  {
    key: "restaurant-register",
    label: "식당 등록하기",
    component: () => <RestaurantRegister />,
  },
{
    key: "restaurant-edit",
    label: "식당 수정",
    component: () => <RestaurantEdit />,
  },
  {
    key: "schedule-view-broadcasts",
    label: "중계 일정 관리",
    component: () => <BroadcastView />,
  },
] as const;

export type MenuKey = (typeof menuItems)[number]["key"];
export type ExtendedSubpage = MenuKey | "broadcast-register" | "broadcast-edit";
