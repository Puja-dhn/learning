import React from "react";

interface IProps {
  children: React.ReactNode;
  orientation?: "Vertical" | "Horizontal";
}

const defaultProps = {
  orientation: "Horizontal",
};

function TabHeader(props: IProps) {
  const { children, orientation } = props;
  const orientationClass =
    orientation && orientation === "Vertical"
      ? "flex flex-col justify-start h-full overflow-auto shadow-md dark:border-[1px] border-gray-100"
      : "flex flex-wrap ";
  return (
    <div
      className={`text-sm font-medium text-center border-b border-gray-200 dark:border-gray-700 ${orientationClass}`}
    >
      {children}
    </div>
  );
}

TabHeader.defaultProps = defaultProps;
export default TabHeader;
