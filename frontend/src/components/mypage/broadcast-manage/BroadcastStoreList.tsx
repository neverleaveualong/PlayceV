import { useMyStores } from "@/hooks/useMyStores";
import useBroadcastStore from "@/stores/broadcastStore";
import { FiTv, FiChevronRight, FiMapPin } from "react-icons/fi";
import FallbackImage from "@/components/common/FallbackImage";

interface BroadcastStoreListProps {
  onSelectStore: () => void;
}

const BroadcastStoreList = ({ onSelectStore }: BroadcastStoreListProps) => {
  const { data: stores = [] } = useMyStores();
  const { setStore } = useBroadcastStore();

  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <FiTv className="text-gray-400 text-xl" />
        </div>
        <p className="text-gray-500 text-sm text-center">
          등록된 식당이 없습니다
        </p>
        <p className="text-gray-400 text-xs text-center">
          식당을 먼저 등록한 후 중계 일정을 관리할 수 있어요
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-darkgray mb-3">
        중계 일정을 관리할 식당을 선택하세요
      </p>
      <ul className="flex flex-col gap-2.5">
        {stores.map((store) => (
          <li
            key={store.store_id}
            className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:bg-primary4/30 cursor-pointer transition-all duration-150"
            onClick={() => {
              setStore(store.store_id);
              onSelectStore();
            }}
          >
            <FallbackImage
              src={store.main_img || "/noimg.png"}
              alt={store.store_name}
              className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 py-0.5">
              <span className="font-bold text-[15px] text-mainText truncate block">
                {store.store_name}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <FiMapPin className="text-[11px] text-gray-400 flex-shrink-0" />
                <p className="text-xs text-darkgray truncate">{store.address}</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400 group-hover:text-primary5 text-lg flex-shrink-0 transition-colors" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BroadcastStoreList;
