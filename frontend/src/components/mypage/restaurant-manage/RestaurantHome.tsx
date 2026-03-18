import { useState } from "react";
import useMypageStore from "@/stores/mypageStore";
import { FiEdit2, FiPlus, FiTrash2, FiMapPin } from "react-icons/fi";
import ConfirmModal from "@/components/common/ConfirmModal";
import useToastStore from "@/stores/toastStore";
import { useMyStores, useDeleteStore } from "@/hooks/useMyStores";
import { getApiErrorMessage } from "@/utils/apiErrorStatusMessage";
import FallbackImage from "@/components/common/FallbackImage";

const RestaurantHome = () => {
  const { data: stores = [] } = useMyStores();
  const deleteMutation = useDeleteStore();
  const { setRestaurantSubpage, setRestaurantEditId, setRestaurantEditName } =
    useMypageStore();
  const { addToast } = useToastStore();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    deleteMutation.mutate(id, {
      onError: (error) => addToast(getApiErrorMessage(error), "error"),
    });
  };

  const handleEdit = (store: { store_id: number; store_name: string }) => {
    setRestaurantEditId(store.store_id);
    setRestaurantEditName(store.store_name);
    setRestaurantSubpage("restaurant-edit");
  };

  return (
    <section>
      {stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <FiMapPin className="text-gray-400 text-xl" />
          </div>
          <p className="text-gray-500 text-sm">등록된 식당이 없습니다</p>
          <button
            onClick={() => {
              setRestaurantEditId(null);
              setRestaurantEditName(null);
              setRestaurantSubpage("restaurant-register");
            }}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary5 hover:underline"
          >
            <FiPlus className="text-base" />
            첫 식당 등록하기
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-darkgray mb-3">
            수정할 식당을 선택하세요
          </p>
          {/* 카드 리스트 */}
          <ul className="flex flex-col gap-2.5">
            {stores.map((store) => (
              <li
                key={store.store_id}
                className="group relative flex items-center gap-3.5 p-3 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:bg-primary4/30 cursor-pointer transition-all duration-150"
                onClick={() => handleEdit(store)}
              >
                <FallbackImage
                  src={store.main_img || "/noimg.png"}
                  alt={store.store_name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 py-0.5">
                  <span className="font-bold text-[15px] text-mainText truncate block">
                    {store.store_name}
                  </span>
                  <div className="flex items-center gap-1 mt-1.5">
                    <FiMapPin className="text-[11px] text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-darkgray truncate">{store.address}</p>
                  </div>
                </div>

                {/* 삭제 버튼 — hover 시 표시 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(store.store_id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:border-red-300 transition-all duration-150"
                  title="삭제"
                >
                  <FiTrash2 className="text-red-500 text-sm" />
                </button>
              </li>
            ))}
          </ul>

          {/* 식당 추가 버튼 */}
          <button
            onClick={() => {
              setRestaurantEditId(null);
              setRestaurantEditName(null);
              setRestaurantSubpage("restaurant-register");
            }}
            className="w-full mt-3 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-darkgray font-medium flex items-center justify-center gap-1.5 hover:border-primary5 hover:text-primary5 transition-colors duration-150"
          >
            <FiPlus className="text-base" />
            식당 추가
          </button>
        </>
      )}

      {deleteTargetId !== null && (
        <ConfirmModal
          message="정말 이 식당을 삭제하시겠습니까?"
          variant="danger"
          confirmLabel="삭제"
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
