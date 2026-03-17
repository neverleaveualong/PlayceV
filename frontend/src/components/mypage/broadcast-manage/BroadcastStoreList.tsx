import { useMyStores } from "@/hooks/useMyStores";
import useBroadcastStore from "@/stores/broadcastStore";
import EmptyMessage from "@/components/restaurant/EmptyMessage";
import { FiTv } from "react-icons/fi";

interface BroadcastStoreListProps {
  onSelectStore: () => void;
}

const BroadcastStoreList = ({ onSelectStore }: BroadcastStoreListProps) => {
  const { data: stores = [] } = useMyStores();
  const { setStore } = useBroadcastStore();

  if (stores.length === 0) {
    return <EmptyMessage message="등록된 식당이 없습니다. 식당을 먼저 등록해주세요." />;
  }

  return (
    <ul>
      {stores.map((store) => (
        <li
          key={store.store_id}
          className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-primary3/30 cursor-pointer transition-colors"
          onClick={() => {
            setStore(store.store_id);
            onSelectStore();
          }}
        >
          <img
            src={store.main_img || "/noimg.png"}
            alt={store.store_name}
            className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-100"
          />
          <div className="flex-1 min-w-0">
            <span className="block text-lg font-semibold text-gray-900 truncate">
              {store.store_name}
            </span>
            <span className="text-gray-500 text-sm truncate mt-1 block">
              {store.address}
            </span>
          </div>
          <FiTv className="text-primary5 text-xl flex-shrink-0" />
        </li>
      ))}
    </ul>
  );
};

export default BroadcastStoreList;
