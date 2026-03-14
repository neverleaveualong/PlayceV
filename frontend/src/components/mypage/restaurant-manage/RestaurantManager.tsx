import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import useMypageStore from "@/stores/mypageStore";
import {
  menuItems,
  type ExtendedSubpage,
} from "@/types/restaurant-manage.types";
import type { MypageProps } from "@/components/mypage/MypageModal";
import useBroadcastStore from "@/stores/broadcastStore";
import SectionHeader from "@/components/common/SectionHeader";
import ConfirmModal from "@/components/common/ConfirmModal";
import BroadcastRegister from "@/components/broadcast/BroadcastRegister";
import BroadcastEdit from "@/components/broadcast/BroadcastEdit";

const RestaurantManager = ({ onClose }: MypageProps) => {
  const { restaurantSubpage, restaurantEditName, setRestaurantSubpage } =
    useMypageStore();
  const { resetYMD } = useBroadcastStore();
  const [showEditCancelConfirm, setShowEditCancelConfirm] = useState(false);

  const getModalTitle = (key: ExtendedSubpage) => {
    if (key === "broadcast-register") return "중계 일정 등록";
    if (key === "broadcast-edit") return "중계 일정 수정";
    if (key === "restaurant-edit") return `식당 수정 - ${restaurantEditName}`;

    const item = menuItems.find((i) => i.key === key);
    return item?.label ?? "";
  };

  const getComponents = (key: ExtendedSubpage) => {
    if (key === "broadcast-register")
      return <BroadcastRegister onClose={onClose} />;
    if (key === "broadcast-edit") return <BroadcastEdit onClose={onClose} />;

    const item = menuItems.find((i) => i.key === key);
    return item?.component();
  };

  return (
    <div className="px-2">
      <SectionHeader
        title={getModalTitle(restaurantSubpage)}
        onClose={onClose}
        leftAction={
          restaurantSubpage !== "restaurant-home" && (
            <FaArrowLeft
              className="hover:cursor-pointer hover:text-primary5"
              onClick={() => {
                if (
                  restaurantSubpage === "broadcast-register" ||
                  restaurantSubpage === "broadcast-edit"
                ) {
                  setRestaurantSubpage("schedule-view-broadcasts");
                } else if (restaurantSubpage === "schedule-view-broadcasts") {
                  setRestaurantSubpage("restaurant-home");
                  resetYMD();
                } else if (restaurantSubpage === "restaurant-edit") {
                  setShowEditCancelConfirm(true);
                } else {
                  setRestaurantSubpage("restaurant-home");
                }
              }}
            />
          )
        }
      />

      <div>{getComponents(restaurantSubpage)}</div>
      {showEditCancelConfirm && (
        <ConfirmModal
          message="식당 수정을 취소하시겠습니까?"
          onConfirm={() => {
            setShowEditCancelConfirm(false);
            setRestaurantSubpage("restaurant-home");
          }}
          onCancel={() => setShowEditCancelConfirm(false)}
        />
      )}
    </div>
  );
};

export default RestaurantManager;
