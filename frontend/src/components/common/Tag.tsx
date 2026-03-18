import { FiX } from "react-icons/fi";

interface TagProps {
  label: string;
  onRemove: () => void;
}

const Tag = ({ label, onRemove }: TagProps) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary4 text-primary5 rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-red-400 transition-colors"
        aria-label={`${label} 제거`}
      >
        <FiX className="text-[10px]" />
      </button>
    </span>
  );
};

export default Tag;
