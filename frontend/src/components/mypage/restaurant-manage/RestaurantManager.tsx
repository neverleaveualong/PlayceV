import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import useMypageStore from "@/stores/mypageStore";
import {
  menuItems,
  type ExtendedSubpage,
} from "@/types/restaurant-manage.types";
import type { MypageProps } from "@/components/mypage/MypageModal";
import SectionHeader from "@/components/common/SectionHeader";
import ConfirmModal from "@/components/common/ConfirmModal";

const RestaurantManager = ({ onClose }: MypageProps) => {
  const { restaurantSubpage, restaurantEditName, setRestaurantSubpage } =
    useMypageStore();
  const [showEditCancelConfirm, setShowEditCancelConfirm] = useState(false);

  const getModalTitle = (key: ExtendedSubpage) => {
    if (key === "restaurant-edit") return `식당 수정 - ${restaurantEditName}`;

    const item = menuItems.find((i) => i.key === key);
    return item?.label ?? "";
  };

  const getComponents = (key: ExtendedSubpage) => {
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
                if (restaurantSubpage === "restaurant-edit") {
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
