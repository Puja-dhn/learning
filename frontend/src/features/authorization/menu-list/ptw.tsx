import React from "react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentPlusIconSolid from "@heroicons/react/24/solid/DocumentPlusIcon";

import IMenuItem from "../types/IMenuItem";

import LogPtw from "@/pages/ptw/LogPtw";
import ViewPtw from "@/pages/ptw/ViewPtw";
import ApprovePtw from "@/pages/ptw/ApprovePtw";
import LogViolations from "@/pages/ptw/LogViolations";
import ViewViolations from "@/pages/ptw/ViewViolations";
import CloseViolations from "@/pages/ptw/CloseViolations";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const PTW_MENU_LIST: IMenuItem[] = [
  {
    id: 5,
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
    id: 23,
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
    id: 5,
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
    id: 8,
    name: "View PTW",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "view-ptw",
    element: <ViewPtw />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 9,
    name: "Approve PTW",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "approve-ptw",
    element: <ApprovePtw />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 12,
    name: "Log Violations",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "log-violations",
    element: <LogViolations />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 13,
    name: "View Violations",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "view-violations",
    element: <ViewViolations />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 14,
    name: "Close Violations",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "close-violations",
    element: <CloseViolations />,
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
