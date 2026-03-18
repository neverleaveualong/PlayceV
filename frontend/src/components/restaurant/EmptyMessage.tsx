import { FiInbox } from "react-icons/fi";

export default function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 select-none">
      <FiInbox className="text-3xl text-gray-300" />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
}
