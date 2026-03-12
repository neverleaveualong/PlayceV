import BroadcastRegisterEdit from "./BroadcastRegisterEdit";
import useBroadcastStore from "@/stores/broadcastStore";

const BroadcastRegister = ({ onClose }: { onClose: () => void }) => {
  const { storeId } = useBroadcastStore();

  return (
    <div className="p-4">
      <BroadcastRegisterEdit
        mode="create"
        storeId={storeId}
        onClose={onClose}
      />
    </div>
  );
};

export default BroadcastRegister;
