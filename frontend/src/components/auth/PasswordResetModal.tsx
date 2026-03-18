import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBase from "@/components/common/ModalBase";
import useToastStore from "@/stores/toastStore";
import { FiLock, FiShield, FiMapPin } from "react-icons/fi";

const PasswordResetModal = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { userPasswordReset } = useAuth();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ newPassword: string; confirmPassword: string }>();

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }
    if (!token) return;
    setLoading(true);
    const success = await userPasswordReset({ token, newPassword: data.newPassword });
    setLoading(false);
    if (!success) return;
    addToast("비밀번호가 변경되었습니다!", "success");
    navigate("/");
  };

  return (
    <ModalBase
      onClose={() => navigate("/")}
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
            새 비밀번호 설정
          </h3>
          <p className="text-xs text-gray-400">
            새로운 비밀번호를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 새 비밀번호 */}
          <fieldset>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              새 비밀번호
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="password"
                placeholder="6자 이상 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  placeholder-gray-300 hover:border-primary5 focus:border-primary5
                  focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors"
                {...register("newPassword", { required: true, minLength: 6 })}
              />
            </div>
            {errors.newPassword && (
              <ErrorMessage message="새 비밀번호를 입력해주세요 (6자 이상)" />
            )}
          </fieldset>

          {/* 비밀번호 확인 */}
          <fieldset>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              비밀번호 확인
            </label>
            <div className="relative">
              <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  placeholder-gray-300 hover:border-primary5 focus:border-primary5
                  focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors"
                {...register("confirmPassword", { required: true })}
              />
            </div>
            {errors.confirmPassword && (
              <ErrorMessage
                message={errors.confirmPassword.message || "비밀번호 확인을 입력해주세요"}
              />
            )}
          </fieldset>

          {/* 변경 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary5 text-white
              font-semibold rounded-lg hover:bg-primary5/90 active:scale-[0.98]
              transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiShield className="text-sm" />
            )}
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>

        {/* 홈으로 돌아가기 */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-primary5 transition-colors"
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
          rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    </ModalBase>
  );
};

export default PasswordResetModal;
