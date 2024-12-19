import React from "react";

interface IProps {
  children: React.ReactNode;
}

function TabContent(props: IProps) {
  const { children } = props;

  return <div className="h-full w-full overflow-auto">{children}</div>;
}

export default TabContent;
