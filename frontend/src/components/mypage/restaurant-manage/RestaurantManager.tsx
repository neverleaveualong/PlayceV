import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import useMypageStore from "@/stores/mypageStore";
import {
  menuItems,
  type ExtendedSubpage,
} from "@/types/restaurant-manage.types";
import ConfirmModal from "@/components/common/ConfirmModal";

const RestaurantManager = () => {
  const { restaurantSubpage, restaurantEditName, setRestaurantSubpage } =
    useMypageStore();
  const [showEditCancelConfirm, setShowEditCancelConfirm] = useState(false);

  const getModalTitle = (key: ExtendedSubpage) => {
    if (key === "restaurant-edit") return `${restaurantEditName} 수정`;
    const item = menuItems.find((i) => i.key === key);
    return item?.label ?? "";
  };

  const getComponents = (key: ExtendedSubpage) => {
    const item = menuItems.find((i) => i.key === key);
    return item?.component();
  };

  const isSubpage = restaurantSubpage !== "restaurant-home";

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        {isSubpage && (
          <button
            onClick={() => {
              if (restaurantSubpage === "restaurant-edit") {
                setShowEditCancelConfirm(true);
              } else {
                setRestaurantSubpage("restaurant-home");
              }
            }}
            className="p-1.5 rounded-lg text-darkgray hover:text-primary5 hover:bg-primary4/30 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
          </button>
        )}
        <h2 className="text-xl font-semibold text-mainText">
          {getModalTitle(restaurantSubpage)}
        </h2>
      </div>

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
