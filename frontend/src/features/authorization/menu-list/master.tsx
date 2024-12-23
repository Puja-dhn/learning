import React from "react";

import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";

import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import UsersIconSolid from "@heroicons/react/24/solid/UsersIcon";
import IMenuItem from "../types/IMenuItem";

const Dashboard = React.lazy(() => import("@/pages/master/Dashboard"));
const ContextDefinations = React.lazy(
  () => import("@/pages/master/ContextDefinations"),
);
const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const MASTER_MENU_LIST: IMenuItem[] = [
  {
    id: 1,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "",
    element: <Dashboard />,
    children: [],
    menuType: "Static",
  },
  {
    id: 2,
    name: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "dashboard",
    element: <Dashboard />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 6,
    name: "Users",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "users",
    element: <Dashboard />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 10,
    name: "Context Definations",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "context-definations",
    element: <ContextDefinations />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 1,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "*",
    element: <PageNotFound />,
    children: [],
    menuType: "Static",
  },
];

export default MASTER_MENU_LIST;
