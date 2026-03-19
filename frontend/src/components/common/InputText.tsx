import React from "react";
import classNames from "classnames";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={classNames(
          "border border-gray-300 px-4 py-2 rounded-xl w-full text-mainText text-sm",
          "placeholder-gray-400",
          "hover:border-primary5 focus:border-primary5 focus:outline-none focus:ring-2 focus:ring-primary1",
          "transition-colors duration-150",
          className
        )}
        autoComplete="off"
        {...props}
      />
    );
  }
);

InputText.displayName = "InputText";
export default InputText;
