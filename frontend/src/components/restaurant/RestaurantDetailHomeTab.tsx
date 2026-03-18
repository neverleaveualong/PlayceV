import { FiMapPin, FiClock, FiPhone, FiFileText } from "react-icons/fi";
import type { RestaurantDetail } from "@/types/restaurant.types";
import classNames from "classnames";

export default function RestaurantDetailHomeTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  return (
    <div className="flex flex-col gap-4">
      {detail.is_owner && (
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-1 bg-primary5 text-white rounded-md text-xs font-bold">
            내 가게
          </span>
        </div>
      )}
      <h2
        className={classNames(
          "text-2xl font-bold text-mainText",
          detail.description ? "mb-1" : "mb-0"
        )}
      >
        {detail.store_name}
      </h2>
      {detail.description && (
        <p className="text-gray-600 text-sm leading-relaxed">{detail.description}</p>
      )}
      <div className="flex flex-col gap-3 mt-1">
        <InfoRow icon={<FiMapPin />} text={detail.address} />
        <InfoRow icon={<FiClock />} text={detail.opening_hours} />
        <InfoRow icon={<FiPhone />} text={detail.phone} />
        <InfoRow icon={<FiFileText />} text={detail.type} />
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary5 text-lg flex-shrink-0">{icon}</span>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}
