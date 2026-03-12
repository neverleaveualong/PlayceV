import {
  login,
  signup,
  type LoginProps,
  type SignupProps,
  passwordResetRequest,
  passwordReset,
  type PasswordResetRequestProps,
  type PasswordResetProps,
} from "@/api/auth.api";
import useAuthStore from "@/stores/authStore";
import useToastStore from "@/stores/toastStore";
import { getApiErrorMessage } from "@/utils/apiErrorStatusMessage";

export const useAuth = () => {
  const { storeLogin, storeLogout, setIsLoginModalOpen, setIsSignupModalOpen } =
    useAuthStore();
  const { addToast } = useToastStore();

  const userLogin = async (data: LoginProps) => {
    try {
      const res = await login(data);
      storeLogin(res.data.token);
      addToast("로그인이 완료되었습니다.", "success");
      setIsLoginModalOpen(false);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    }
  };

  const userLogout = async () => {
    try {
      storeLogout();
      addToast("로그아웃이 완료되었습니다.", "success");
    } catch (error) {
      addToast("로그아웃에 실패하였습니다", "error");
    }
  };

  const userSignup = async (data: SignupProps) => {
    try {
      await signup(data);
      addToast("회원가입이 완료되었습니다.", "success");
      setIsSignupModalOpen(false);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    }
  };

  // 비밀번호 초기화 요청
  const userPasswordResetRequest = async (data: PasswordResetRequestProps) => {
    try {
      await passwordResetRequest(data);
      addToast("비밀번호 재설정 메일이 전송되었습니다.", "success");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    }
  };

  // 비밀번호 재설정
  const userPasswordReset = async (data: PasswordResetProps) => {
    try {
      await passwordReset(data);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    }
  };

  return {
    userLogin,
    userLogout,
    userSignup,
    userPasswordResetRequest,
    userPasswordReset,
  };
};
