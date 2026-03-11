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
    <div className="absolute top-5 right-5 z-10 text-lg">
      <div className="flex gap-3">
        {isLoggedIn ? (
          <>
            <Button
              icon={<FaSignOutAlt />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => userLogout()}
            >
              로그아웃
            </Button>
            <Button
              icon={<FaUserAlt />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => setIsMypageOpen(true)}
            >
              마이페이지
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<FaSignInAlt />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => {
                setIsLoginModalOpen(true);
              }}
            >
              로그인
            </Button>
            <Button
              icon={<FaUserPlus />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => {
                setIsSignupModalOpen(true);
              }}
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
