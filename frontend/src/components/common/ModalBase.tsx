import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import classNames from "classnames";
import Button from "./Button";

interface ModalBaseProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  hideHeader?: boolean;
  className?: string;
  type?: "auth" | "mypage";
}

const ModalBase = ({
  children,
  onClose,
  title,
  hideHeader = false,
  className,
  type,
}: ModalBaseProps) => {
  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-[9999] flex justify-center bg-black/40 backdrop-blur-[2px]",
        type === "auth"
          ? "items-center py-6 overflow-y-auto"
          : "items-center"
      )}
      onClick={type === "auth" ? undefined : onClose}
    >
      <div
        className={classNames(
          "bg-white rounded-2xl shadow-2xl flex flex-col relative",
          type === "auth" ? "max-h-fit" : "max-h-[90vh] overflow-hidden",
          { "w-modal-auth": type === "auth" },
          { "w-modal-lg": type === "mypage" },
          { "w-modal-md": type !== "auth" && type !== "mypage" },
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="text-lg font-bold text-mainText">
              {title}
            </h2>
            <Button
              onClick={onClose}
              scheme="close"
              size="icon"
              className="text-mainText"
            >
              <FaTimes />
            </Button>
          </div>
        )}

        <div
          className={classNames(
            "overflow-y-auto flex-grow",
            { "mt-0": type === "mypage" },
            { "mt-5": type !== "mypage" }
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalBase;
