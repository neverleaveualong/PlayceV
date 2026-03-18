import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AuthHeader from "@/components/auth/AuthHeader";
import Map from "@/components/map/PlayceMap";
import RestaurantDetailComponent from "@/components/restaurant/RestaurantDetail";
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
  const { position, isSidebarOpen, toggleSidebar, selectedStoreId, closeDetail } =
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
        className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "w-sidebar" : "w-0"
        }`}
      >
        {selectedStoreId !== null ? (
          <RestaurantDetailComponent
            storeId={selectedStoreId}
            onClose={closeDetail}
          />
        ) : (
          <SearchPage />
        )}
      </div>

      {/* 토글 버튼 — 화면 기준 fixed */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 -translate-y-1/2 z-30
          w-5 h-16 bg-white border border-l-0 border-gray-200
          rounded-r-lg shadow-md
          flex items-center justify-center
          hover:bg-primary4 transition-all duration-300
          ${isSidebarOpen ? "left-sidebar" : "left-0"}`}
        aria-label={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
      >
        {isSidebarOpen ? (
          <FiChevronLeft className="text-gray-500 text-base" />
        ) : (
          <FiChevronRight className="text-gray-500 text-base" />
        )}
      </button>

      {/* 지도 영역 */}
      <div className="relative flex-1 h-screen">
        {position && <Map />}
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
