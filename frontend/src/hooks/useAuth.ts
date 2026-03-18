import { useState } from "react";
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
  const [isPending, setIsPending] = useState(false);

  const userLogin = async (data: LoginProps) => {
    setIsPending(true);
    try {
      const res = await login(data);
      storeLogin(res.data.token);
      addToast("로그인이 완료되었습니다.", "success");
      setIsLoginModalOpen(false);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsPending(false);
    }
  };

  const userLogout = () => {
    storeLogout();
    addToast("로그아웃이 완료되었습니다.", "success");
  };

  const userSignup = async (data: SignupProps) => {
    setIsPending(true);
    try {
      await signup(data);
      addToast("회원가입이 완료되었습니다.", "success");
      setIsSignupModalOpen(false);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsPending(false);
    }
  };

  // 비밀번호 초기화 요청
  const userPasswordResetRequest = async (data: PasswordResetRequestProps) => {
    setIsPending(true);
    try {
      await passwordResetRequest(data);
      addToast("비밀번호 재설정 메일이 전송되었습니다.", "success");
      return true;
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
      return false;
    } finally {
      setIsPending(false);
    }
  };

  // 비밀번호 재설정
  const userPasswordReset = async (data: PasswordResetProps) => {
    setIsPending(true);
    try {
      await passwordReset(data);
      return true;
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return {
    userLogin,
    userLogout,
    userSignup,
    userPasswordResetRequest,
    userPasswordReset,
    isPending,
  };
};
