import BroadcastRegisterEdit from "./BroadcastRegisterEdit";
import useBroadcastStore from "@/stores/broadcastStore";

const BroadcastRegister = () => {
  const { storeId } = useBroadcastStore();

  return (
    <div>
      <BroadcastRegisterEdit mode="create" storeId={storeId} />
    </div>
  );
};

export default BroadcastRegister;
