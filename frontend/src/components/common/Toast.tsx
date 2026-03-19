import { memo } from "react";
import useToastStore from "@/stores/toastStore";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const iconMap = {
  success: <FiCheckCircle className="text-xl flex-shrink-0" />,
  error: <FiAlertCircle className="text-xl flex-shrink-0" />,
  info: <FiInfo className="text-xl flex-shrink-0" />,
};

const colorMap = {
  success: "bg-green-50 border-green-300 text-green-800",
  error: "bg-red-50 border-red-300 text-red-800",
  info: "bg-gray-50 border-gray-300 text-gray-800",
};

const Toast = memo(function Toast() {
  const { toasts, dismissToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10001] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex items-center gap-3 px-4 md:px-5 py-3.5 rounded-xl border shadow-xl min-w-0 w-[90vw] md:min-w-[280px] md:w-auto md:max-w-[400px] ${
            toast.isExiting ? "animate-slide-out" : "animate-slide-up"
          } ${colorMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
});

export default Toast;
