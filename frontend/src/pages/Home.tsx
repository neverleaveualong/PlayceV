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
      {/* 사이드바 — 데스크톱: 좌측 패널 / 모바일: 풀스크린 오버레이 */}
      <div
        className={`
          flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden bg-white
          md:relative md:z-auto
          ${isSidebarOpen
            ? "fixed inset-0 z-40 w-full md:static md:w-sidebar"
            : "w-0"
          }
        `}
      >
        {selectedStoreId !== null ? (
          <RestaurantDetailComponent
            key={selectedStoreId}
            storeId={selectedStoreId}
            onClose={closeDetail}
          />
        ) : (
          <SearchPage />
        )}

        {/* 모바일 닫기는 AppHeader에 통합됨 */}
      </div>

      {/* 토글 버튼 — 데스크톱 전용 */}
      <button
        onClick={toggleSidebar}
        className={`hidden md:flex fixed top-1/2 -translate-y-1/2 z-30
          w-5 h-16 bg-white border border-l-0 border-gray-200
          rounded-r-lg shadow-md
          items-center justify-center
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

        {/* 로고 — 사이드바 닫혔을 때만 표시 */}
        <div
          className={`fixed top-5 left-5 z-10 flex items-center gap-2 select-none pointer-events-none transition-opacity duration-200 ${
            isSidebarOpen ? "opacity-0" : "opacity-100 delay-300"
          }`}
        >
          <img src="/favicon.svg" alt="" className="w-9 h-9 drop-shadow-md" />
          <span className="text-lg font-bold text-primary5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] tracking-tight">
            Playce
          </span>
        </div>

        <AuthHeader />

        <Suspense fallback={<LoadingSpinner />}>
          <LoginModal />
          <SignupModal />
          <PasswordResetRequestModal />
        </Suspense>
      </div>

      {/* 모바일 사이드바 열기 버튼 — 지도 위 좌측 하단 */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-8 left-4 z-30 md:hidden w-12 h-12 bg-primary5 text-white rounded-full shadow-lg flex items-center justify-center hover:brightness-95 transition-all"
          aria-label="검색 열기"
        >
          <FiChevronRight className="text-xl" />
        </button>
      )}

      {isMypageOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <MypageModal onClose={() => setIsMypageOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
