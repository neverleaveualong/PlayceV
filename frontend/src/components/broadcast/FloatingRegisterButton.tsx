import { FiPlus } from "react-icons/fi";
import Button from "@/components/common/Button";

interface FloatingRegisterButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingRegisterButton = ({
  onClick,
  className = "",
}: FloatingRegisterButtonProps) => {
  return (
    <Button
      onClick={onClick}
      scheme="primary"
      size="floating"
      icon={<FiPlus />}
      className={className}
    />
  );
};

export default FloatingRegisterButton;
