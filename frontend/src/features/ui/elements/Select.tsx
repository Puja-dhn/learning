import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  value: number | string;
  onChange?: (e: any) => void;
  className?: string;
  disabled?: boolean;
  disableTabFocus?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  id?: string;
}

const defaultProps = {
  onChange: () => null,
  className: "",
  disabled: false,
  disableTabFocus: false,
  size: "md",
  id: "",
};

function Select(props: Props) {
  const {
    children,
    onChange,
    className,
    value,
    disabled,
    size,
    disableTabFocus,
    id,
  } = props;
  let sizeClass = "p-2 px-2.5 text-sm ";
  switch (size) {
    case "xs":
      sizeClass = "p-0.5 px-1 text-[11px] ";
      break;
    case "sm":
      sizeClass = "p-1 px-1.5 text-xs ";
      break;
    case "lg":
      sizeClass = "p-2 px-4 text-md ";
      break;
    default:
      sizeClass = "p-2 px-2.5 text-sm ";
  }
  return (
    <select
      id={id}
      tabIndex={disableTabFocus ? -1 : 0}
      className={twMerge(`bg-gray-50 border border-gray-300 text-gray-900 text-sm 
  focus:ring-blue-500 focus:border-blue-500 block w-full p-2 px-2.5 dark:bg-gray-700 
  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
  dark:focus:border-blue-500 ${sizeClass}  ${className}`)}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

Select.defaultProps = defaultProps;
export default Select;
