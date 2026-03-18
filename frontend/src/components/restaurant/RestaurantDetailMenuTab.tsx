import { memo } from "react";
import { FaUtensils } from "react-icons/fa";
import type { RestaurantDetail, MenuItem } from "@/types/restaurant.types";
import EmptyMessage from "./EmptyMessage";

function formatPrice(price: string): string {
  const num = Number(price);
  if (isNaN(num) || num === 0) return price || "-";
  return `${num.toLocaleString()}원`;
}

const RestaurantDetailMenuTab = memo(function RestaurantDetailMenuTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  const menus: MenuItem[] = Array.isArray(detail.menus) ? detail.menus : [];

  if (menus.length === 0) {
    return <EmptyMessage message="등록된 메뉴 정보가 없습니다." />;
  }

  return (
    <div className="rounded-xl border border-gray-100 divide-y divide-gray-100">
      {menus.map((menu, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between gap-3 px-4 py-3.5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary4/50 flex items-center justify-center flex-shrink-0">
              <FaUtensils className="text-primary5 text-xs" />
            </div>
            <span className="font-medium text-gray-800 truncate">{menu.name}</span>
          </div>
          <span className="text-primary5 font-bold text-sm flex-shrink-0">
            {formatPrice(menu.price)}
          </span>
        </div>
      ))}
    </div>
  );
});

export default RestaurantDetailMenuTab;
