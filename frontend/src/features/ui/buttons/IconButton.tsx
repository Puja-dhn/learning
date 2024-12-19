import React from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  noBackground?: boolean;
  noFocus?: boolean;
  btnType?: "default" | "primary" | "reset" | "error";
  disabled?: boolean;
  disableTabFocus?: boolean;
  onBlur?: () => void;
}

const defaultProps = {
  onClick: () => null,
  className: "",
  noBackground: false,
  noFocus: false,
  btnType: "default",
  disabled: false,
  disableTabFocus: false,
  onBlur: () => null,
};

function IconButton(props: IProps) {
  const {
    children,
    onClick,
    className,
    noBackground,
    noFocus,
    btnType,
    disabled,
    disableTabFocus,
    onBlur,
  } = props;

  let backgroundClass =
    "text-blue-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 shadow-md dark:bg-opacity-90";
  switch (btnType) {
    case "primary":
      backgroundClass =
        "text-blue-900 bg-cyan-400 hover:bg-gray-400 dark:bg-cyan-500 dark:text-blue-900 dark:hover:bg-gray-500";
      break;
    case "reset":
      backgroundClass =
        "text-white bg-gray-500 hover:bg-gray-700 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500";
      break;
    case "error":
      backgroundClass =
        "text-red-900 bg-red-200 hover:bg-red-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 shadow-md dark:bg-opacity-90";
      break;
    default:
      backgroundClass =
        "text-blue-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 shadow-md dark:bg-opacity-90";
  }

  if (noBackground) {
    switch (btnType) {
      case "primary":
        backgroundClass =
          "text-cyan-400 hover:text-gray-400 dark:text-cyan-500 dark:text-blue-900 dark:hover:text-gray-500";
        break;
      case "reset":
        backgroundClass =
          "text-gray-500 hover:text-gray-700 dark:text-gray-700 dark:text-white dark:hover:text-gray-500";
        break;
      case "error":
        backgroundClass =
          "text-red-700 hover:text-red-500 dark:text-red-300 dark:hover:text-red-400";
        break;
      default:
        backgroundClass =
          "text-gray-500 hover:text-blue-700 hover:shadow-md dark:text-gray-400 dark:hover:text-gray-300";
    }
  }

  const focusClass = noFocus
    ? ""
    : "focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-gray-300";

  return (
    <button
      tabIndex={disableTabFocus ? -1 : 0}
      type="button"
      className={twMerge(`inline-flex justify-between items-center gap-2 p-2 rounded-lg text-sm font-medium text-center 
         bg-opacity-50
      ${backgroundClass} 
      ${focusClass} 
       ${className}`)}
      onClick={onClick}
      onBlur={onBlur}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

IconButton.defaultProps = defaultProps;
export default IconButton;
