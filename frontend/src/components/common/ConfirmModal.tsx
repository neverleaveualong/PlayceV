import { createPortal } from "react-dom";
import Button from "./Button";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-gray-800 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button
            scheme="secondary"
            fullWidth
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            scheme="primary"
            fullWidth
            onClick={onConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
