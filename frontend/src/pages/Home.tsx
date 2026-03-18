import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AuthHeader from "@/components/auth/AuthHeader";
import Map from "@/components/map/PlayceMap";
import SpotRefreshButton from "@/components/map/SpotRefreshButton";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import useMapStore from "@/stores/mapStore";
import useMypageStore from "@/stores/mypageStore";
import SearchPage from "./SearchPage";
import { FiChevronRight } from "react-icons/fi";

const LoginModal = lazy(() => import("@/components/auth/Login"));
const SignupModal = lazy(() => import("@/components/auth/Signup"));
const PasswordResetRequestModal = lazy(
  () => import("@/components/auth/PasswordResetRequestModal")
);
const MypageModal = lazy(() => import("@/components/mypage/MypageModal"));

const Home: React.FC = () => {
  const { position, isRefreshBtnOn, isSidebarOpen, toggleSidebar } =
    useMapStore();
  const { isMypageOpen, setIsMypageOpen } = useMypageStore();

  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24,
  };

  useGeoLocation(geolocationOptions);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 사이드바 */}
      <div
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-sidebar" : "w-0"
        } overflow-hidden`}
      >
        <SearchPage />
      </div>

      {/* 지도 영역 */}
      <div className="relative flex-1 h-screen">
        {position && <Map />}
        {isRefreshBtnOn && <SpotRefreshButton />}
        <AuthHeader />

        {/* 사이드바 열기 버튼 */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-30
              bg-white shadow-lg border border-gray-200
              rounded-r-lg px-1 py-6
              hover:bg-primary4 transition-colors"
            aria-label="사이드바 열기"
          >
            <FiChevronRight className="text-gray-500 text-lg" />
          </button>
        )}

        <Suspense fallback={<LoadingSpinner />}>
          <LoginModal />
          <SignupModal />
          <PasswordResetRequestModal />
        </Suspense>
      </div>
      {isMypageOpen && (
        <Suspense
          fallback={
            <div className="fixed right-0 top-0 h-full w-sidebar bg-white z-[100] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <MypageModal onClose={() => setIsMypageOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
