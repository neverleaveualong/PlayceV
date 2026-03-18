import { useState } from "react";
import { FiMapPin, FiClock, FiPhone, FiFileText, FiCopy, FiCheck } from "react-icons/fi";
import type { RestaurantDetail } from "@/types/restaurant.types";

export default function RestaurantDetailHomeTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(detail.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API 미지원 시 무시
    }
  };

  const infoItems = [
    detail.address && {
      icon: <FiMapPin />,
      content: (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm text-gray-700 truncate">{detail.address}</span>
          <button
            onClick={handleCopyAddress}
            className="text-gray-400 hover:text-primary5 transition flex-shrink-0"
            aria-label="주소 복사"
          >
            {copied ? <FiCheck className="text-primary5 text-sm" /> : <FiCopy className="text-sm" />}
          </button>
        </div>
      ),
    },
    detail.opening_hours && {
      icon: <FiClock />,
      content: <span className="text-sm text-gray-700">{detail.opening_hours}</span>,
    },
    detail.phone && {
      icon: <FiPhone />,
      content: (
        <a href={`tel:${detail.phone}`} className="text-sm text-primary5 font-medium hover:underline">
          {detail.phone}
        </a>
      ),
    },
    detail.type && {
      icon: <FiFileText />,
      content: <span className="text-sm text-gray-700">{detail.type}</span>,
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      {/* 설명 */}
      {detail.description && (
        <p className="text-gray-600 text-sm leading-relaxed">{detail.description}</p>
      )}

      {detail.is_owner && (
        <span className="self-start px-2.5 py-1 bg-primary5 text-white rounded-md text-xs font-bold">
          내 가게
        </span>
      )}

      {/* 정보 */}
      {infoItems.length > 0 && (
        <div className="rounded-xl border border-gray-100 divide-y divide-gray-100">
          {infoItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-4 py-3">
              <span className="text-primary5 text-base flex-shrink-0">{item.icon}</span>
              {item.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
