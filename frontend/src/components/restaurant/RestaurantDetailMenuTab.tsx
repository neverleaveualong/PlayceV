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
    <ul className="flex flex-col">
      {menus.map((menu, idx) => (
        <li
          key={idx}
          className={`flex items-center justify-between gap-3 px-4 py-3.5
            ${idx !== menus.length - 1 ? "border-b border-gray-100" : ""}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <FaUtensils className="text-primary5 text-sm flex-shrink-0" />
            <span className="font-medium text-gray-800 truncate">{menu.name}</span>
          </div>
          <span className="text-gray-600 font-semibold text-sm flex-shrink-0 ml-2">
            {formatPrice(menu.price)}
          </span>
        </li>
      ))}
    </ul>
  );
});

export default RestaurantDetailMenuTab;
