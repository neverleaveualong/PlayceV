import Button from "@/components/common/Button";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserAlt,
  FaUserPlus,
} from "react-icons/fa";
import useAuthStore from "@/stores/authStore";
import useMypageStore from "@/stores/mypageStore";
import { useAuth } from "@/hooks/useAuth";

const AuthHeader: React.FC = () => {
  const { isLoggedIn, setIsLoginModalOpen, setIsSignupModalOpen } =
    useAuthStore();
  const { setIsMypageOpen } = useMypageStore();
  const { userLogout } = useAuth();

  // 모바일: 아이콘만 (w-10 h-10 원형), 데스크톱: 아이콘+텍스트
  const mobileIconBtn = "w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-1.5";

  return (
    <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
      <div className="flex gap-1.5 md:gap-2">
        {isLoggedIn ? (
          <>
            <Button
              icon={<FaSignOutAlt />}
              size="semi"
              scheme="custom"
              className={`bg-white/90 backdrop-blur-sm text-gray-600 hover:text-primary5 hover:bg-white rounded-full shadow-md border border-gray-100 ${mobileIconBtn}`}
              onClick={() => userLogout()}
            >
              <span className="hidden md:inline">로그아웃</span>
            </Button>
            <Button
              icon={<FaUserAlt />}
              size="semi"
              scheme="custom"
              className={`bg-primary5 text-white hover:brightness-95 rounded-full shadow-md ${mobileIconBtn}`}
              onClick={() => setIsMypageOpen(true)}
            >
              <span className="hidden md:inline">마이페이지</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<FaSignInAlt />}
              size="semi"
              scheme="custom"
              className={`bg-white/90 backdrop-blur-sm text-gray-600 hover:text-primary5 hover:bg-white rounded-full shadow-md border border-gray-100 ${mobileIconBtn}`}
              onClick={() => setIsLoginModalOpen(true)}
            >
              <span className="hidden md:inline">로그인</span>
            </Button>
            <Button
              icon={<FaUserPlus />}
              size="semi"
              scheme="custom"
              className={`bg-primary5 text-white hover:brightness-95 rounded-full shadow-md ${mobileIconBtn}`}
              onClick={() => setIsSignupModalOpen(true)}
            >
              <span className="hidden md:inline">회원가입</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthHeader;
