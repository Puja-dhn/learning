import React from "react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentPlusIconSolid from "@heroicons/react/24/solid/DocumentPlusIcon";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import DocumentMagnifyingGlassIconSolid from "@heroicons/react/24/solid/DocumentMagnifyingGlassIcon";

import IMenuItem from "../types/IMenuItem";
import LogAect from "@/pages/aect/LogAect";
import ViewAect from "@/pages/aect/ViewAect";
import Dashboard from "@/pages/aect/Dashboard";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const AECT_MENU_LIST: IMenuItem[] = [
  {
    id: 7,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "",
    element: <Dashboard />,
    children: [],
    menuType: "Static",
  },
  {
    id: 7,
    name: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "dashboard",
    element: <Dashboard />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 8,
    name: "Log AECT",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "log-aect",
    element: <LogAect />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 9,
    name: "View AECT",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "view-aect",
    element: <ViewAect />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 0,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "*",
    element: <PageNotFound />,
    children: [],
    menuType: "Static",
  },
];

export default AECT_MENU_LIST;
