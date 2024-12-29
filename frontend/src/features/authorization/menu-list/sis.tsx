import React from "react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentPlusIconSolid from "@heroicons/react/24/solid/DocumentPlusIcon";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import DocumentMagnifyingGlassIconSolid from "@heroicons/react/24/solid/DocumentMagnifyingGlassIcon";

import IMenuItem from "../types/IMenuItem";

import ViewSio from "@/pages/sis/ViewSio";

import LogSis from "@/pages/sis/LogSis";
import AssignPDC from "@/pages/sis/AssignPDC";
import ActionTaken from "@/pages/sis/ActionTaken";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const SIS_MENU_LIST: IMenuItem[] = [
  {
    id: 7,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "",
    element: <LogSis />,
    children: [],
    menuType: "Static",
  },
  {
    id: 22,
    name: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "dashboard",
    element: <LogSis />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 1,
    name: "Log SIO",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "log-sio",
    element: <LogSis />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 2,
    name: "View SIO",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "view-sio",
    element: <ViewSio />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 3,
    name: "Assign PDC",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "assign-pdc",
    element: <AssignPDC />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 4,
    name: "Action Taken",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "action-taken",
    element: <ActionTaken />,
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

export default SIS_MENU_LIST;
