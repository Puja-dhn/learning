import React from "react";

interface IProps {
  children: React.ReactNode;
  orientation?: "Vertical" | "Horizontal";
}

const defaultProps = {
  orientation: "Horizontal",
};

function Tabs(props: IProps) {
  const { children, orientation } = props;

  const orientationClass =
    orientation && orientation === "Horizontal"
      ? "grid-rows-[auto_1fr]"
      : "grid-cols-[300px_auto]";
  return (
    <div className={`grid w-full h-full ${orientationClass} `}>{children}</div>
  );
}

Tabs.defaultProps = defaultProps;
export default Tabs;
