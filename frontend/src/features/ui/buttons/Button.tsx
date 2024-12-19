import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  btnType?:
    | "default"
    | "primary"
    | "reset"
    | "secondary"
    | "success"
    | "error"
    | "info";
  disabled?: boolean;
  elementRef?: React.RefObject<HTMLButtonElement>;
}

const defaultProps = {
  onClick: () => null,
  className: "",
  btnType: "default",
  disabled: false,
  elementRef: null,
};

function Button(props: Props) {
  const { children, onClick, className, btnType, disabled, elementRef } = props;
  let backgroundClass =
    "text-blue-900 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 ";
  switch (btnType) {
    case "primary":
      backgroundClass =
        "text-blue-900 bg-cyan-400 hover:bg-gray-400 dark:bg-cyan-500 dark:text-blue-900 dark:hover:bg-gray-500";
      break;
    case "reset":
      backgroundClass =
        "text-blue-900 bg-gray-400 hover:text-white hover:bg-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500";
      break;
    case "secondary":
      backgroundClass =
        "text-blue-900 bg-amber-400 hover:text-white hover:bg-gray-500 dark:bg-amber-600 dark:text-white dark:hover:bg-gray-500";
      break;
    case "success":
      backgroundClass =
        "text-blue-900 bg-green-400 hover:text-white hover:bg-gray-500 dark:bg-green-800 dark:text-white dark:hover:bg-gray-500";
      break;
    case "error":
      backgroundClass =
        "text-blue-900 bg-red-400 hover:text-white hover:bg-gray-500 dark:bg-red-800 dark:text-white dark:hover:bg-gray-500";
      break;
    case "info":
      backgroundClass =
        "text-blue-900 bg-blue-400 hover:text-white hover:bg-gray-500 dark:bg-blue-800 dark:text-white dark:hover:bg-gray-500";
      break;
    default:
      backgroundClass =
        "text-blue-900 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 ";
  }
  return (
    <button
      type="button"
      className={twMerge(`inline-flex items-center gap-2 text-sm font-medium rounded-lg  px-5 py-2 text-center
        focus:ring-2 focus:outline-none focus:ring-blue-300 
        dark:focus:ring-gray-300 bg-opacity-50
       ${backgroundClass}
       ${className}`)}
      onClick={onClick}
      disabled={disabled}
      ref={elementRef}
    >
      {children}
    </button>
  );
}

Button.defaultProps = defaultProps;
export default Button;
