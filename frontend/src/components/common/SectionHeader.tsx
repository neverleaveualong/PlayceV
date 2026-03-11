import { FaTimes } from "react-icons/fa";
import Button from "@/components/common/Button";

interface SectionHeaderProps {
  title: string;
  onClose?: () => void;
  leftAction?: React.ReactNode;
}

const SectionHeader = ({ title, onClose, leftAction }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between text-lg font-semibold my-5">
      <div className="flex items-center gap-3">
        {leftAction}
        <div className="flex items-center gap-3 text-xl text-mainText">
          {title}
        </div>
      </div>
      <Button
        onClick={onClose}
        scheme="close"
        size="icon"
        className="text-mainText"
      >
        <FaTimes />
      </Button>
    </div>
  );
};

export default SectionHeader;
