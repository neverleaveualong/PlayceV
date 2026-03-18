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

  return (
    <div className="flex flex-col gap-5">
      {/* 가게명 + 배지 */}
      <div>
        {detail.is_owner && (
          <span className="inline-block px-2.5 py-1 bg-primary5 text-white rounded-md text-xs font-bold mb-2">
            내 가게
          </span>
        )}
        <h2 className="text-2xl font-bold text-mainText">{detail.store_name}</h2>
        {detail.description && (
          <p className="text-gray-500 text-sm leading-relaxed mt-2">{detail.description}</p>
        )}
      </div>

      {/* 정보 카드 */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
        {/* 주소 — 복사 기능 */}
        {detail.address && (
          <div className="flex items-start gap-3 group">
            <FiMapPin className="text-primary5 text-lg flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 flex-1">{detail.address}</span>
            <button
              onClick={handleCopyAddress}
              className="text-gray-400 hover:text-primary5 transition flex-shrink-0"
              aria-label="주소 복사"
            >
              {copied ? (
                <FiCheck className="text-primary5 text-base" />
              ) : (
                <FiCopy className="text-base" />
              )}
            </button>
          </div>
        )}

        {/* 영업시간 */}
        {detail.opening_hours && (
          <div className="flex items-start gap-3">
            <FiClock className="text-primary5 text-lg flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{detail.opening_hours}</span>
          </div>
        )}

        {/* 전화번호 — 클릭하면 전화 */}
        {detail.phone && (
          <div className="flex items-center gap-3">
            <FiPhone className="text-primary5 text-lg flex-shrink-0" />
            <a
              href={`tel:${detail.phone}`}
              className="text-sm text-primary5 font-medium hover:underline"
            >
              {detail.phone}
            </a>
          </div>
        )}

        {/* 업종 */}
        {detail.type && (
          <div className="flex items-center gap-3">
            <FiFileText className="text-primary5 text-lg flex-shrink-0" />
            <span className="text-sm text-gray-700">{detail.type}</span>
          </div>
        )}
      </div>
    </div>
  );
}
