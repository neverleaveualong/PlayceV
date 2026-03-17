import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  scheme?:
    | "primary"
    | "secondary"
    | "close"
    | "tab"
    | "custom"
    | "apply"
    | "reset"
    | "danger"
    | "ghost"
    | "storeCircle";
  size?: "small" | "medium" | "large" | "icon" | "semi" | "floating";
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  hoverColor?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      scheme = "primary",
      size = "medium",
      isLoading = false,
      fullWidth = false,
      icon,
      hoverColor,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyle = classNames(
      "inline-flex items-center justify-center rounded transition-colors duration-200",
      scheme !== "storeCircle" && "font-semibold"
    );

    const schemeStyle = {
      primary:
        "bg-primary5 text-white border border-primary5 hover:brightness-95",
      secondary:
        "bg-white text-primary5 border border-primary5 hover:bg-primary5 hover:border-primary5 hover:text-white",
      close: "text-gray-400 hover:text-primary5",
      tab: "bg-transparent text-gray-400 hover:text-primary5 border-b-2 border-transparent",
      custom: "",
      apply:
        "bg-primary5 text-white border border-primary5 hover:brightness-95",
      reset:
        "bg-white text-primary5 border border-primary5 hover:bg-gray-100 hover:text-primary5 hover:border-primary5",
      danger:
        "bg-white text-red-500 border border-red-300 hover:bg-red-50 hover:border-red-400",
      ghost:
        "bg-gray-100 text-gray-700 hover:bg-gray-200",
      storeCircle: classNames(
        "w-8 h-8 flex items-center justify-center bg-white rounded-full shadow transition ml-1",
        hoverColor === "blue-50" && "hover:bg-blue-50",
        hoverColor === "red-50" && "hover:bg-red-50",
        hoverColor === "gray-100" && "hover:bg-gray-100"
      ),
    };

    const sizeStyle = {
      small: "px-3 py-1 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-5 py-3 text-xl",
      semi: "px-4 py-1.5 text-sm",
      icon: "p-2 text-lg",
      floating: "w-12 h-12 rounded-full shadow-lg",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={classNames(
          baseStyle,
          schemeStyle[scheme],
          sizeStyle[size],
          fullWidth && "w-full",
          isLoading && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          "로딩중..."
        ) : (
          <>
            {icon && (
              <span
                className={classNames(
                  "flex items-center",
                  React.isValidElement(children) || typeof children === "string"
                    ? "mr-2"
                    : null,
                  scheme === "storeCircle" && "mr-0"
                )}
              >
                {icon}
              </span>
            )}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
