import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import InputText from "@/components/common/InputText";
import Button from "@/components/common/Button";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ModalBase from "@/components/common/ModalBase";
import useToastStore from "@/stores/toastStore";

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
    await userPasswordReset({ token, newPassword: data.newPassword });
    setLoading(false);
    addToast("비밀번호가 변경되었습니다!", "success");
    navigate("/");
  };

  return (
    <ModalBase
      onClose={() => navigate("/")}
      title="비밀번호 재설정"
      className="p-5"
      type="auth"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 mt-5">
          <fieldset>
            <InputText
              placeholder="새 비밀번호"
              type="password"
              {...register("newPassword", { required: true })}
            />
            {errors.newPassword && (
              <ErrorMessage message="새 비밀번호를 입력해주세요" />
            )}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="비밀번호 확인"
              type="password"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <ErrorMessage
                message={
                  errors.confirmPassword.message ||
                  "비밀번호 확인을 입력해주세요"
                }
              />
            )}
          </fieldset>
          <Button
            type="submit"
            className="mt-5"
            scheme="primary"
            disabled={loading}
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default PasswordResetModal;
