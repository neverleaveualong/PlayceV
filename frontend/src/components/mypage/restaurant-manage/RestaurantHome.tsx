import { useState } from "react";
import useMypageStore from "@/stores/mypageStore";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import RestaurantDetailComponent from "@/components/restaurant/RestaurantDetail";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import useToastStore from "@/stores/toastStore";
import useRestaurantDetail from "@/hooks/useRestaurantDetail";
import { useMyStores, useDeleteStore } from "@/hooks/useMyStores";
import { getApiErrorMessage } from "@/utils/apiErrorStatusMessage";
import EmptyMessage from "@/components/restaurant/EmptyMessage";

const RestaurantHome = () => {
  const { data: stores = [] } = useMyStores();
  const deleteMutation = useDeleteStore();
  const { selectedStoreId: selectedDetailStoreId, openDetail, closeDetail } = useRestaurantDetail();
  const { setRestaurantSubpage, setRestaurantEditId, setRestaurantEditName } =
    useMypageStore();
  const { addToast } = useToastStore();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    deleteMutation.mutate(id, {
      onError: (error) => addToast(getApiErrorMessage(error), "error"),
    });
  };

  return (
    <section>
      <div className="flex justify-end mb-3">
        <Button
          scheme="primary"
          size="semi"
          icon={<FiPlus />}
          onClick={() => {
            setRestaurantEditId(null);
            setRestaurantEditName(null);
            setRestaurantSubpage("restaurant-register");
          }}
        >
          식당 등록
        </Button>
      </div>
      {stores.length === 0 ? (
        <EmptyMessage message="등록된 식당이 없습니다." />
      ) : (
        <ul>
          {stores.map((store) => (
            <li
              key={store.store_id}
              className="list-none flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-primary3/30 cursor-pointer transition-colors"
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
                  <span className="block text-base font-semibold text-gray-900 truncate">
                    {store.store_name}
                  </span>
                </div>
                <div className="text-gray-500 text-sm truncate mt-1">
                  {store.address}
                </div>
              </div>
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
                title="수정"
              ></Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTargetId(store.store_id);
                }}
                scheme="storeCircle"
                icon={<FiTrash2 className="text-red-500 text-xl" />}
                hoverColor="red-50"
                title="삭제"
              ></Button>
            </li>
          ))}
        </ul>
      )}
      {/* 상세보기 */}
      {selectedDetailStoreId && (
        <RestaurantDetailComponent
          storeId={selectedDetailStoreId}
          onClose={closeDetail}
        />
      )}
      {deleteTargetId !== null && (
        <ConfirmModal
          message="정말 이 식당을 삭제하시겠습니까?"
          onConfirm={() => {
            handleRemove(deleteTargetId);
            setDeleteTargetId(null);
          }}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </section>
  );
};

export default RestaurantHome;
