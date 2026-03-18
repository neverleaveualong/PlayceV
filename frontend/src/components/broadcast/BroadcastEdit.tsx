import BroadcastRegisterEdit from "./BroadcastRegisterEdit";
import useBroadcastStore from "@/stores/broadcastStore";

const BroadcastEdit = () => {
  const { storeId, editingId } = useBroadcastStore();

  if (!editingId) return <div className="py-10 text-center text-sm text-gray-400">잘못된 접근입니다.</div>;

  return (
    <div>
      <BroadcastRegisterEdit mode="edit" broadcastId={editingId} storeId={storeId} />
    </div>
  );
};

export default BroadcastEdit;
