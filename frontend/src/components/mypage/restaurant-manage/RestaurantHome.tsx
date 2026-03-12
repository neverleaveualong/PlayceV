import useMypageStore from "@/stores/mypageStore";
import { FiEdit2, FiTrash2, FiTv } from "react-icons/fi";
import RestaurantDetailComponent from "@/components/restaurant/RestaurantDetail";
import Button from "@/components/common/Button";
import useBroadcastStore from "@/stores/broadcastStore";
import FloatingRegisterButton from "@/components/broadcast/FloatingRegisterButton";
import useToastStore from "@/stores/toastStore";
import useRestaurantDetail from "@/hooks/useRestaurantDetail";
import { useMyStores, useDeleteStore } from "@/hooks/useMyStores";
import { getApiErrorMessage } from "@/utils/apiErrorStatusMessage";

const RestaurantHome = () => {
  const { data: stores = [] } = useMyStores();
  const deleteMutation = useDeleteStore();
  const { selectedStoreId: selectedDetailStoreId, openDetail, closeDetail } = useRestaurantDetail();
  const { setRestaurantSubpage, setRestaurantEditId, setRestaurantEditName } =
    useMypageStore();
  const { setStore } = useBroadcastStore();
  const { addToast } = useToastStore();

  const handleRemove = (id: number) => {
    if (window.confirm("정말 이 식당을 삭제하시겠습니까?")) {
      deleteMutation.mutate(id, {
        onError: (error) => addToast(getApiErrorMessage(error), "error"),
      });
    }
  };

  return (
    <section>
      {stores.length === 0 ? (
        <div className="text-gray-400 text-center py-20 text-lg tracking-wide">
          등록된 식당이 없습니다.
        </div>
      ) : (
        <ul>
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0 hover:bg-primary4 hover:cursor-pointer"
              onClick={() => {
                openDetail(store.store_id);
              }}
            >
              <img
                src={store.main_img || "/noimg.png"}
                alt={store.store_name}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="block text-lg font-semibold text-gray-900 truncate">
                    {store.store_name}
                  </span>
                </div>
                <div className="text-gray-500 text-sm truncate mt-1">
                  {store.address}
                </div>
              </div>
              {/* 중계 */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setStore(store.store_name, store.store_id);
                  setRestaurantSubpage("schedule-view-broadcasts");
                }}
                scheme="storeCircle"
                icon={<FiTv className="text-primary5 text-xl" />}
                hoverColor="lightgray"
              ></Button>
              {/* 수정 버튼 */}

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setRestaurantEditId(store.store_id);
                  setRestaurantEditName(store.store_name);
                  setRestaurantSubpage("restaurant-edit");
                }}
                scheme="storeCircle"
                icon={<FiEdit2 className="text-blue-500 text-xl" />}
                hoverColor="blue-50"
              ></Button>
              {/* 삭제 버튼 */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(store.store_id);
                }}
                scheme="storeCircle"
                icon={<FiTrash2 className="text-red-500 text-xl" />}
                hoverColor="red-50"
              ></Button>
            </div>
          ))}
        </ul>
      )}
      <FloatingRegisterButton
        className={`absolute bottom-10 right-10`}
        onClick={() => setRestaurantSubpage("restaurant-register")}
      />
      {/* 상세보기 */}
      {selectedDetailStoreId && (
        <RestaurantDetailComponent
          storeId={selectedDetailStoreId}
          onClose={closeDetail}
        />
      )}
    </section>
  );
};

export default RestaurantHome;
