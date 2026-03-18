import { createPortal } from "react-dom";
import { FiAlertCircle } from "react-icons/fi";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
}

const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "default",
}: ConfirmModalProps) => {
  const isDanger = variant === "danger";

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[320px] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 본문 */}
        <div className="flex flex-col items-center gap-3 px-6 pt-7 pb-5">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${
              isDanger ? "bg-red-50" : "bg-primary4"
            }`}
          >
            <FiAlertCircle
              className={`text-xl ${isDanger ? "text-red-500" : "text-primary5"}`}
            />
          </div>
          <p className="text-sm text-mainText text-center leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-medium text-darkgray hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
              isDanger
                ? "text-red-500 hover:bg-red-50"
                : "text-primary5 hover:bg-primary4/30"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
