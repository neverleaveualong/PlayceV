import AuthHeader from "@/components/auth/AuthHeader";
import LoginModal from "@/components/auth/Login";
import SignupModal from "@/components/auth/Signup";
import Map from "@/components/map/PlayceMap";
import SpotRefreshButton from "@/components/map/SpotRefreshButton";
import MypageModal from "@/components/mypage/MypageModal";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import useMapStore from "@/stores/mapStore";
import useMypageStore from "@/stores/mypageStore";
import SearchPage from "./SearchPage";
import PasswordResetRequestModal from "@/components/auth/PasswordResetRequestModal";

const Home: React.FC = () => {
  const { position, isRefreshBtnOn } = useMapStore();
  const { isMypageOpen, setIsMypageOpen } = useMypageStore();
  const { setRestaurantSubpage } = useMypageStore();
  const { setSelectedTab } = useMypageStore();

  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24,
  };

  const handleClose = () => {
    setIsMypageOpen(false);
    setRestaurantSubpage("restaurant-home");
    setSelectedTab("favorite");
  };

  useGeoLocation(geolocationOptions);

  return (
    <div className="flex">
      <SearchPage />
      <div className="relative w-full h-screen">
        {position && <Map />}
        {/* 이 위치에서 재탐색 버튼 */}
        {isRefreshBtnOn && <SpotRefreshButton />}
        <AuthHeader />
        <LoginModal />
        <SignupModal />
        <PasswordResetRequestModal />
      </div>
      {isMypageOpen && <MypageModal onClose={() => handleClose()} />}
    </div>
  );
};

export default Home;
