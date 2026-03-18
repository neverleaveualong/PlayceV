import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AuthHeader from "@/components/auth/AuthHeader";
import Map from "@/components/map/PlayceMap";
import SpotRefreshButton from "@/components/map/SpotRefreshButton";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import useMapStore from "@/stores/mapStore";
import useMypageStore from "@/stores/mypageStore";
import SearchPage from "./SearchPage";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
      {/* 사이드바 + 토글 버튼을 하나로 묶음 */}
      <div className="relative flex-shrink-0">
        {/* 사이드바 */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarOpen ? "w-sidebar" : "w-0"
          }`}
        >
          <SearchPage />
        </div>

        {/* 토글 버튼 — 사이드바 우측 모서리 중앙에 고정 */}
        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 -translate-y-1/2 -right-4 z-30
            w-4 h-12 bg-white border border-l-0 border-gray-200
            rounded-r-md shadow-sm
            flex items-center justify-center
            hover:bg-primary4 transition-colors"
          aria-label={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
        >
          {isSidebarOpen ? (
            <FiChevronLeft className="text-gray-400 text-sm" />
          ) : (
            <FiChevronRight className="text-gray-400 text-sm" />
          )}
        </button>
      </div>

      {/* 지도 영역 */}
      <div className="relative flex-1 h-screen">
        {position && <Map />}
        {isRefreshBtnOn && <SpotRefreshButton />}
        <AuthHeader />

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
