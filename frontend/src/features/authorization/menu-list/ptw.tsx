import React from "react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentPlusIconSolid from "@heroicons/react/24/solid/DocumentPlusIcon";

import IMenuItem from "../types/IMenuItem";

import LogPtw from "@/pages/ptw/LogPtw";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const PTW_MENU_LIST: IMenuItem[] = [
  {
    id: 7,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "",
    element: <LogPtw />,
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
    element: <LogPtw />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 1,
    name: "Log PTW",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "log-ptw",
    element: <LogPtw />,
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

export default PTW_MENU_LIST;
