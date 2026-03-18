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
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="flex gap-2">
        {isLoggedIn ? (
          <>
            <Button
              icon={<FaSignOutAlt />}
              size="semi"
              scheme="custom"
              className="bg-white/90 backdrop-blur-sm text-gray-600 hover:text-primary5 hover:bg-white rounded-full shadow-md border border-gray-100"
              onClick={() => userLogout()}
            >
              로그아웃
            </Button>
            <Button
              icon={<FaUserAlt />}
              size="semi"
              scheme="custom"
              className="bg-primary5 text-white hover:brightness-95 rounded-full shadow-md"
              onClick={() => setIsMypageOpen(true)}
            >
              마이페이지
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<FaSignInAlt />}
              size="semi"
              scheme="custom"
              className="bg-white/90 backdrop-blur-sm text-gray-600 hover:text-primary5 hover:bg-white rounded-full shadow-md border border-gray-100"
              onClick={() => setIsLoginModalOpen(true)}
            >
              로그인
            </Button>
            <Button
              icon={<FaUserPlus />}
              size="semi"
              scheme="custom"
              className="bg-primary5 text-white hover:brightness-95 rounded-full shadow-md"
              onClick={() => setIsSignupModalOpen(true)}
            >
              회원가입
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthHeader;
