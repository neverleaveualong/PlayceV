import RestaurantHome from "@/components/mypage/restaurant-manage/RestaurantHome";
import RestaurantRegisterEdit from "@/components/mypage/restaurant-manage/RestaurantRegisterEdit";

export const menuItems = [
  {
    key: "restaurant-home",
    label: "식당 관리",
    component: () => <RestaurantHome />,
  },
  {
    key: "restaurant-register",
    label: "식당 등록하기",
    component: () => <RestaurantRegisterEdit mode="create" />,
  },
  {
    key: "restaurant-edit",
    label: "식당 수정",
    component: () => <RestaurantRegisterEdit mode="edit" />,
  },
] as const;

export type MenuKey = (typeof menuItems)[number]["key"];
export type ExtendedSubpage = MenuKey | "broadcast-register" | "broadcast-edit" | "schedule-view-broadcasts";
