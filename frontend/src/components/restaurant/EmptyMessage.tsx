import { FiInbox } from "react-icons/fi";

export default function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400 select-none">
      <FiInbox className="text-3xl" />
      <span className="text-base">{message}</span>
    </div>
  );
}
