import React from "react";

import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import UsersIconSolid from "@heroicons/react/24/solid/UsersIcon";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import ChartBarSquareIconSolid from "@heroicons/react/24/solid/ChartBarSquareIcon";
import { CogIcon } from "@heroicons/react/24/outline";
import IMenuItem from "../types/IMenuItem";
import Users from "@/pages/master/Users";
import OrgStructures from "@/pages/master/OrgStructures";

const Dashboard = React.lazy(() => import("@/pages/master/Dashboard"));
const ContextDefinations = React.lazy(
  () => import("@/pages/master/ContextDefinations"),
);
const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const MASTER_MENU_LIST: IMenuItem[] = [
  {
    id: 0,
    name: "Dashboard",
    icon: <ChartBarSquareIcon className="w-5 h-5" />,
    iconSelected: <ChartBarSquareIconSolid className="w-5 h-5" />,
    appId: 0,
    path: "",
    element: <Dashboard />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 1,
    name: "Users",
    icon: <UsersIcon className="w-5 h-5" />,
    iconSelected: <UsersIconSolid className="w-5 h-5" />,
    appId: 0,
    path: "users",
    element: <Users />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 2,
    name: "Context Definations",
    icon: <CogIcon className="w-5 h-5" />,
    iconSelected: <CogIcon className="w-5 h-5" />,
    appId: 0,
    path: "context-definations",
    element: <ContextDefinations />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 3,
    name: "Org. Structure",
    icon: <UserGroupIcon className="w-5 h-5" />,
    iconSelected: <UserGroupIcon className="w-5 h-5" />,
    appId: 0,
    path: "org-structure",
    element: <OrgStructures />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 0,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 0,
    path: "*",
    element: <PageNotFound />,
    children: [],
    menuType: "Static",
  },
];

export default MASTER_MENU_LIST;
