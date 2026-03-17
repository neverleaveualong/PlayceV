import { FaArrowLeft } from "react-icons/fa";
import useMypageStore from "@/stores/mypageStore";
import useBroadcastStore from "@/stores/broadcastStore";
import SectionHeader from "@/components/common/SectionHeader";
import BroadcastRegister from "@/components/broadcast/BroadcastRegister";
import BroadcastEdit from "@/components/broadcast/BroadcastEdit";
import BroadcastStoreList from "./BroadcastStoreList";
import BroadcastView from "@/components/broadcast/BroadcastView";
import { useState, useEffect } from "react";
import type { MypageProps } from "@/components/mypage/MypageModal";

type BroadcastSubpage =
  | "store-list"
  | "schedule-view"
  | "broadcast-register"
  | "broadcast-edit";

const BroadcastManager = ({ onClose }: MypageProps) => {
  const { storeId, resetYMD } = useBroadcastStore();
  const { restaurantSubpage, setRestaurantSubpage } = useMypageStore();
  const [subpage, setSubpage] = useState<BroadcastSubpage>(
    storeId ? "schedule-view" : "store-list"
  );

  // BroadcastRegisterEdit/TabLists 내부에서 setRestaurantSubpage를 호출하므로 동기화
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

  return (
    <div className="px-2">
      <SectionHeader
        title={titleMap[subpage]}
        onClose={onClose}
        leftAction={
          subpage !== "store-list" && (
            <FaArrowLeft
              className="hover:cursor-pointer hover:text-primary5"
              onClick={handleBack}
            />
          )
        }
      />
      <div>
        {subpage === "store-list" && (
          <BroadcastStoreList
            onSelectStore={() => setSubpage("schedule-view")}
          />
        )}
        {subpage === "schedule-view" && (
          <BroadcastView onRegister={handleRegister} />
        )}
        {subpage === "broadcast-register" && (
          <BroadcastRegister onClose={onClose} />
        )}
        {subpage === "broadcast-edit" && (
          <BroadcastEdit onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default BroadcastManager;
