import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AuthHeader from "@/components/auth/AuthHeader";
import Map from "@/components/map/PlayceMap";
import SpotRefreshButton from "@/components/map/SpotRefreshButton";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import useMapStore from "@/stores/mapStore";
import useMypageStore from "@/stores/mypageStore";
import SearchPage from "./SearchPage";

const LoginModal = lazy(() => import("@/components/auth/Login"));
const SignupModal = lazy(() => import("@/components/auth/Signup"));
const PasswordResetRequestModal = lazy(
  () => import("@/components/auth/PasswordResetRequestModal")
);
const MypageModal = lazy(() => import("@/components/mypage/MypageModal"));

const Home: React.FC = () => {
  const { position, isRefreshBtnOn } = useMapStore();
  const { isMypageOpen, setIsMypageOpen, setRestaurantSubpage, setSelectedTab } =
    useMypageStore();

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
        {isRefreshBtnOn && <SpotRefreshButton />}
        <AuthHeader />
        <Suspense>
          <LoginModal />
          <SignupModal />
          <PasswordResetRequestModal />
        </Suspense>
      </div>
      {isMypageOpen && (
        <Suspense fallback={<div className="fixed right-0 top-0 h-full w-[430px] bg-white z-[100] flex items-center justify-center"><LoadingSpinner /></div>}>
          <MypageModal onClose={() => handleClose()} />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
