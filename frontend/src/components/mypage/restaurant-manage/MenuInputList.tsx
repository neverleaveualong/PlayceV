import classNames from "classnames";
import { FiPlus, FiX } from "react-icons/fi";
import type { MenuItem } from "@/types/restaurant.types";
import ErrorMessage from "@/components/common/ErrorMessage";

interface MenuInputListProps {
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;
  error?: string;
}

const inputStyle =
  "border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-mainText placeholder-gray-400 hover:border-primary5 focus:border-primary5 focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors";

const MenuInputList = ({ menus, setMenus, error }: MenuInputListProps) => {
  const handleMenuNameChange = (idx: number, name: string) => {
    setMenus(
      menus.map((m, i) => (i === idx ? { name: name, price: m.price } : m))
    );
  };
  const handleMenuPriceChange = (idx: number, price: string) => {
    setMenus(
      menus.map((m, i) => (i === idx ? { name: m.name, price: price } : m))
    );
  };
  const addMenu = () => setMenus([...menus, { name: "", price: "" }]);
  const removeMenu = (idx: number) =>
    setMenus(menus.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="space-y-2">
        {menus.map((menu, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              className={classNames(
                inputStyle,
                menus.length > 1 ? "w-[58%]" : "w-[63%]"
              )}
              placeholder={`메뉴 ${idx + 1}`}
              value={menu.name}
              onChange={(e) => handleMenuNameChange(idx, e.target.value)}
            />
            <input
              className={classNames(
                inputStyle,
                menus.length > 1 ? "w-[28%]" : "w-[37%]"
              )}
              placeholder="가격"
              value={menu.price}
              onChange={(e) => handleMenuPriceChange(idx, e.target.value)}
            />
            {menus.length > 1 && (
              <button
                type="button"
                onClick={() => removeMenu(idx)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMenu}
          className="flex items-center gap-1 text-sm text-primary5 font-medium hover:underline mt-1"
        >
          <FiPlus className="text-xs" />
          메뉴 추가
        </button>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

export default MenuInputList;
