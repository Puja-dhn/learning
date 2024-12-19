import React from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  children: React.ReactNode;
  isActive?: boolean;
  changeHandler?: () => void;
}

const defaultProps = {
  isActive: false,
  changeHandler: () => null,
};

function Tab(props: IProps) {
  const { children, isActive, changeHandler } = props;
  const activeClass = isActive
    ? " text-cyan-600 hover:text-cyan-600 border-cyan-600 hover:border-cyan-600 dark:text-cyan-300 dark:border-cyan-300 dark:hover:text-cyan-300 dark:hover:border-cyan-300 "
    : " border-transparent ";
  return (
    <button
      type="button"
      onClick={changeHandler}
      className={twMerge(
        `inline-flex p-4 rounded-t-lg border-b-2  text-gray-500 dark:text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${activeClass} `,
      )}
    >
      {children}
    </button>
  );
}

Tab.defaultProps = defaultProps;
export default Tab;
