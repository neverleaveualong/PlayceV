import { FaArrowLeft } from "react-icons/fa";
import useMypageStore from "@/stores/mypageStore";
import useBroadcastStore from "@/stores/broadcastStore";
import BroadcastRegister from "@/components/broadcast/BroadcastRegister";
import BroadcastEdit from "@/components/broadcast/BroadcastEdit";
import BroadcastStoreList from "./BroadcastStoreList";
import BroadcastView from "@/components/broadcast/BroadcastView";
import { useState, useEffect } from "react";

type BroadcastSubpage =
  | "store-list"
  | "schedule-view"
  | "broadcast-register"
  | "broadcast-edit";

const BroadcastManager = () => {
  const { resetYMD, resetStore } = useBroadcastStore();
  const { restaurantSubpage, setRestaurantSubpage } = useMypageStore();
  const [subpage, setSubpage] = useState<BroadcastSubpage>("store-list");

  useEffect(() => {
    resetStore();
    resetYMD();
    setRestaurantSubpage("restaurant-home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (restaurantSubpage === "schedule-view-broadcasts") {
      setSubpage("schedule-view");
    } else if (restaurantSubpage === "broadcast-edit") {
      setSubpage("broadcast-edit");
    } else if (restaurantSubpage === "broadcast-register") {
      setSubpage("broadcast-register");
    }
  }, [restaurantSubpage]);

  const titleMap: Record<BroadcastSubpage, string> = {
    "store-list": "중계 관리",
    "schedule-view": "중계 일정 관리",
    "broadcast-register": "중계 일정 등록",
    "broadcast-edit": "중계 일정 수정",
  };

  const handleBack = () => {
    if (subpage === "broadcast-register" || subpage === "broadcast-edit") {
      setSubpage("schedule-view");
    } else if (subpage === "schedule-view") {
      setSubpage("store-list");
      resetYMD();
    }
  };

  const handleRegister = () => {
    setRestaurantSubpage("broadcast-register");
    setSubpage("broadcast-register");
  };

  const isSubpage = subpage !== "store-list";

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        {isSubpage && (
          <button
            onClick={handleBack}
            className="p-1.5 rounded-lg text-darkgray hover:text-primary5 hover:bg-primary4/30 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
          </button>
        )}
        <h2 className="text-xl font-semibold text-mainText">
          {titleMap[subpage]}
        </h2>
      </div>

      <div>
        {subpage === "store-list" && (
          <BroadcastStoreList onSelectStore={() => setSubpage("schedule-view")} />
        )}
        {subpage === "schedule-view" && (
          <BroadcastView onRegister={handleRegister} />
        )}
        {subpage === "broadcast-register" && (
          <BroadcastRegister />
        )}
        {subpage === "broadcast-edit" && (
          <BroadcastEdit />
        )}
      </div>
    </div>
  );
};

export default BroadcastManager;
