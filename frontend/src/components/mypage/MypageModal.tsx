import { FaTimes } from "react-icons/fa";
import Sidebar from "@/components/mypage/Sidebar";
import UserInfo from "./UserInfo";
import RestaurantManager from "./restaurant-manage/RestaurantManager";
import BroadcastManager from "./broadcast-manage/BroadcastManager";
import useMypageStore from "@/stores/mypageStore";
import { useUserInfo } from "@/hooks/useUser";
import { useMyStores } from "@/hooks/useMyStores";
import { useFavorites } from "@/hooks/useFavorites";
import ModalBase from "@/components/common/ModalBase";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export interface MypageProps {
  onClose: () => void;
}

const MypageModal = ({ onClose }: MypageProps) => {
  const { selectedTab, setSelectedTab } = useMypageStore();
  const { data, isLoading, isError } = useUserInfo();
  const { data: stores } = useMyStores();
  const { data: favorites } = useFavorites();
  const user = data?.data;

  return (
    <ModalBase onClose={onClose} type="mypage" hideHeader>
      <div className="flex h-modal-h w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* 왼쪽 사이드바 */}
        <div className="w-[200px] h-full bg-primary4 flex-shrink-0">
          <Sidebar selected={selectedTab} onSelect={setSelectedTab} />
        </div>

        {/* 오른쪽 콘텐츠 영역 */}
        <div className="relative flex-1 h-full overflow-y-auto">
          {/* 모달 닫기 — 항상 우측 상단 고정 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-darkgray hover:text-mainText transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>

          <div className="p-5 h-full">
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
                    storeCount={stores?.length ?? 0}
                    favoriteCount={favorites?.length ?? 0}
                  />
                )}
              </>
            )}
            {selectedTab === "restaurant" && (
              <RestaurantManager />
            )}
            {selectedTab === "broadcast" && (
              <BroadcastManager />
            )}
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default MypageModal;
