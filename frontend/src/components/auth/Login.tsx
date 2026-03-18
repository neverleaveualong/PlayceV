import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import type { LoginProps } from "@/api/auth.api";
import useAuthStore from "@/stores/authStore";
import ErrorMessage from "@/components/common/ErrorMessage";
import ModalBase from "@/components/common/ModalBase";
import { FiMail, FiLock, FiLogIn, FiMapPin } from "react-icons/fi";

const LoginModal = () => {
  const { userLogin, isPending } = useAuth();
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    setIsSignupModalOpen,
    setIsPasswordResetModalOpen,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const onSubmit = (data: LoginProps) => {
    userLogin(data);
  };

  const handleCancel = () => {
    setIsLoginModalOpen(false);
  };

  const handleGoToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  if (!isLoginModalOpen) return null;

  return (
    <ModalBase onClose={handleCancel} hideHeader type="auth" className="p-0">
      <div className="px-8 pt-8 pb-6">
        {/* 로고 + 환영 문구 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiMapPin className="text-primary5 text-xl" />
            <span className="text-xl font-bold text-primary5">Playce</span>
          </div>
          <p className="text-sm text-gray-500">
            스포츠 중계 맛집을 찾아보세요
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 이메일 */}
          <fieldset>
            <label htmlFor="login-email" className="text-xs font-semibold text-gray-600 mb-1.5 block">
              이메일
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                id="login-email"
                type="email"
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  placeholder-gray-300 hover:border-primary5 focus:border-primary5
                  focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors"
                {...register("email", { required: true })}
              />
            </div>
            {errors.email && <ErrorMessage message="이메일을 입력해주세요" />}
          </fieldset>

          {/* 비밀번호 */}
          <fieldset>
            <label htmlFor="login-password" className="text-xs font-semibold text-gray-600 mb-1.5 block">
              비밀번호
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                id="login-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  placeholder-gray-300 hover:border-primary5 focus:border-primary5
                  focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors"
                {...register("password", { required: true })}
              />
            </div>
            {errors.password && (
              <ErrorMessage message="비밀번호를 입력해주세요" />
            )}
          </fieldset>

          {/* 비밀번호 찾기 */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-primary5 transition-colors"
              onClick={() => {
                setIsLoginModalOpen(false);
                setIsPasswordResetModalOpen(true);
              }}
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary5 text-white
              font-semibold rounded-lg hover:bg-primary5/90 active:scale-[0.98]
              transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiLogIn className="text-base" />
            )}
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 회원가입 전환 */}
        <div className="text-center">
          <span className="text-sm text-gray-500">아직 회원이 아니신가요? </span>
          <button
            type="button"
            onClick={handleGoToSignup}
            className="text-sm font-semibold text-primary5 hover:underline"
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={handleCancel}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
          rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    </ModalBase>
  );
};

export default LoginModal;
