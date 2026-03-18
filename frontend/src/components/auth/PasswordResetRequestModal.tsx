import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import ErrorMessage from "@/components/common/ErrorMessage";
import useAuthStore from "@/stores/authStore";
import ModalBase from "@/components/common/ModalBase";
import { FiMail, FiUser, FiSend, FiMapPin } from "react-icons/fi";

const PasswordResetRequestModal = () => {
  const { userPasswordResetRequest, isPending } = useAuth();
  const {
    isPasswordResetModalOpen,
    setIsPasswordResetModalOpen,
    setIsLoginModalOpen,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; name: string }>();

  const onSubmit = async (data: { email: string; name: string }) => {
    const ok = await userPasswordResetRequest(data);
    if (ok) setIsPasswordResetModalOpen(false);
  };

  const handleBack = () => {
    setIsPasswordResetModalOpen(false);
    setIsLoginModalOpen(true);
  };

  if (!isPasswordResetModalOpen) return null;

  return (
    <ModalBase
      onClose={() => setIsPasswordResetModalOpen(false)}
      hideHeader
      type="auth"
      className="p-0"
    >
      <div className="px-8 pt-8 pb-6">
        {/* 로고 + 안내 문구 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiMapPin className="text-primary5 text-xl" />
            <span className="text-xl font-bold text-primary5">Playce</span>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">
            비밀번호를 잊으셨나요?
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            가입한 이메일과 이름을 입력하시면<br />
            비밀번호 재설정 링크를 보내드립니다
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 이메일 */}
          <fieldset>
            <label htmlFor="reset-email" className="text-xs font-semibold text-gray-600 mb-1.5 block">
              이메일
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                id="reset-email"
                type="email"
                placeholder="가입한 이메일을 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  placeholder-gray-300 hover:border-primary5 focus:border-primary5
                  focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors"
                {...register("email", { required: true })}
              />
            </div>
            {errors.email && <ErrorMessage message="이메일을 입력해주세요" />}
          </fieldset>

          {/* 이름 */}
          <fieldset>
            <label htmlFor="reset-name" className="text-xs font-semibold text-gray-600 mb-1.5 block">
              이름
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                id="reset-name"
                type="text"
                placeholder="가입한 이름을 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  placeholder-gray-300 hover:border-primary5 focus:border-primary5
                  focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors"
                {...register("name", { required: true })}
              />
            </div>
            {errors.name && <ErrorMessage message="이름을 입력해주세요" />}
          </fieldset>

          {/* 발송 버튼 */}
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
              <FiSend className="text-sm" />
            )}
            {isPending ? "발송 중..." : "재설정 메일 보내기"}
          </button>
        </form>

        {/* 로그인으로 돌아가기 */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-gray-400 hover:text-primary5 transition-colors"
          >
            ← 로그인으로 돌아가기
          </button>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={() => setIsPasswordResetModalOpen(false)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
          rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    </ModalBase>
  );
};

export default PasswordResetRequestModal;
