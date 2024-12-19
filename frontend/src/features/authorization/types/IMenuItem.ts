import React from "react";

interface IMenuItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  iconSelected: React.ReactNode;
  appId: number;
  path: string;
  element: React.ReactNode | null;
  children: IMenuItem[];
  menuType: string;
}

export default IMenuItem;
