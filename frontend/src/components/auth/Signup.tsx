import useAuthStore from "@/stores/authStore";
import { useForm } from "react-hook-form";
import type { SignupProps } from "@/api/auth.api";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import ModalBase from "@/components/common/ModalBase";
import { FiUser, FiMail, FiLock, FiPhone, FiSmile, FiUserPlus, FiMapPin } from "react-icons/fi";

interface SignupFormProps {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  phone: string;
}

const FIELDS = [
  { name: "name" as const, label: "이름", icon: FiUser, type: "text", placeholder: "홍길동", rules: { required: "이름을 입력해주세요" } },
  { name: "email" as const, label: "이메일", icon: FiMail, type: "email", placeholder: "example@email.com", rules: { required: "이메일을 입력해주세요", pattern: { value: /^\S+@\S+\.\S+$/, message: "유효한 이메일을 입력해주세요" } } },
  { name: "password" as const, label: "비밀번호", icon: FiLock, type: "password", placeholder: "6자 이상 입력하세요", rules: { required: "비밀번호를 입력해주세요", minLength: { value: 6, message: "6자 이상 입력해주세요" } } },
  { name: "phone" as const, label: "휴대폰 번호", icon: FiPhone, type: "text", placeholder: "010-1234-5678", rules: { required: "휴대폰 번호를 입력해주세요", pattern: { value: /^010-\d{4}-\d{4}$/, message: "010-XXXX-XXXX 형식으로 입력해주세요" } } },
  { name: "nickname" as const, label: "닉네임", icon: FiSmile, type: "text", placeholder: "2~8글자", rules: { required: "닉네임을 입력해주세요", minLength: { value: 2, message: "2글자 이상 입력해주세요" }, maxLength: { value: 8, message: "8글자 이하로 입력해주세요" } } },
] as const;

const SignupModal = () => {
  const { userSignup, isPending } = useAuth();
  const { isSignupModalOpen, setIsSignupModalOpen, setIsLoginModalOpen } =
    useAuthStore();

  const handleCancel = () => {
    setIsSignupModalOpen(false);
  };

  const handleGoToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormProps>();

  const onSubmit = async (data: SignupFormProps) => {
    const signupProps: SignupProps = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      nickname: data.nickname,
    };
    userSignup(signupProps);
  };

  if (!isSignupModalOpen) return null;

  return (
    <ModalBase onClose={handleCancel} hideHeader type="auth" className="p-0">
      <div className="px-7 pt-6 pb-5">
        {/* 로고 + 환영 문구 */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <FiMapPin className="text-primary5 text-lg" />
            <span className="text-lg font-bold text-primary5">Playce</span>
          </div>
          <p className="text-xs text-gray-500">
            회원가입하고 나만의 중계 맛집을 찾아보세요
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* 일반 필드들 + 비밀번호 확인은 password 바로 뒤에 삽입 */}
          {FIELDS.map(({ name, label, icon: Icon, type, placeholder, rules }) => (
            <fieldset key={name}>
              <label htmlFor={`signup-${name}`} className="text-[11px] font-semibold text-gray-600 mb-1 block">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id={`signup-${name}`}
                  type={type}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                    placeholder-gray-300 hover:border-primary5 focus:border-primary5
                    focus:outline-none focus:ring-1 focus:ring-primary1 transition-colors"
                  {...register(name, rules)}
                />
              </div>
              {errors[name] && (
                <ErrorMessage message={errors[name]?.message || `${label}을(를) 입력해주세요`} />
              )}

              {/* 비밀번호 바로 뒤에 비밀번호 확인 */}
              {name === "password" && (
                <div className="mt-3">
                  <label htmlFor="signup-passwordConfirm" className="text-[11px] font-semibold text-gray-600 mb-1 block">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      id="signup-passwordConfirm"
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                        placeholder-gray-300 hover:border-primary5 focus:border-primary5
                        focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors"
                      {...register("passwordConfirm", {
                        required: "비밀번호를 재입력해주세요",
                        validate: (value) =>
                          value === watch("password") || "비밀번호가 일치하지 않습니다",
                      })}
                    />
                  </div>
                  {errors.passwordConfirm && (
                    <ErrorMessage message={errors.passwordConfirm.message} />
                  )}
                </div>
              )}
            </fieldset>
          ))}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 mt-1 bg-primary5 text-white text-sm
              font-semibold rounded-lg hover:bg-primary5/90 active:scale-[0.98]
              transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiUserPlus className="text-base" />
            )}
            {isPending ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 로그인 전환 */}
        <div className="text-center">
          <span className="text-sm text-gray-500">이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={handleGoToLogin}
            className="text-sm font-semibold text-primary5 hover:underline"
          >
            로그인
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

export default SignupModal;
