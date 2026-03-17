import Sidebar from "@/components/mypage/Sidebar";
import UserInfo from "./UserInfo";
import RestaurantManager from "./restaurant-manage/RestaurantManager";
import BroadcastManager from "./broadcast-manage/BroadcastManager";
import useMypageStore from "@/stores/mypageStore";
import { useUserInfo } from "@/hooks/useUser";
import ModalBase from "@/components/common/ModalBase";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export interface MypageProps {
  onClose: () => void;
}

const MypageModal = ({ onClose }: MypageProps) => {
  const { selectedTab, setSelectedTab, setRestaurantSubpage } =
    useMypageStore();

  const handleClose = () => {
    setRestaurantSubpage("restaurant-home");
    setSelectedTab("profile");
    onClose();
  };
  const { data, isLoading, isError } = useUserInfo();
  const user = data?.data;

  return (
    <ModalBase
      onClose={handleClose}
      type="mypage"
      hideHeader
      className="bg-gray-400"
    >
      <div className="flex h-modal-h w-full bg-white rounded-xl overflow-hidden">
        {/* 왼쪽 사이드바 */}
        <div className="w-[220px] h-full bg-primary4 flex-shrink-0 border-r border-gray-200">
          <Sidebar selected={selectedTab} onSelect={setSelectedTab} />
        </div>
        {/* 오른쪽 콘텐츠 영역 */}
        <div className="relative flex-1 h-full p-6 overflow-y-auto">
          {selectedTab === "profile" && (
            <>
              {isLoading && (
                <LoadingSpinner message="프로필을 불러오는 중..." />
              )}
              {isError && <p>유저 정보를 불러오지 못했습니다.</p>}
              {user && (
                <UserInfo
                  email={user.email}
                  name={user.name}
                  nickname={user.nickname}
                  phone={user.phone}
                  onClose={handleClose}
                />
              )}
            </>
          )}
          {selectedTab === "restaurant" && (
            <RestaurantManager onClose={handleClose} />
          )}
          {selectedTab === "broadcast" && (
            <BroadcastManager onClose={handleClose} />
          )}
        </div>
      </div>
    </ModalBase>
  );
};

export default MypageModal;
