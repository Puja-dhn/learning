import React from "react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentPlusIconSolid from "@heroicons/react/24/solid/DocumentPlusIcon";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import DocumentMagnifyingGlassIconSolid from "@heroicons/react/24/solid/DocumentMagnifyingGlassIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import DocumentTextIconSolid from "@heroicons/react/24/solid/DocumentTextIcon";
import ChartBarSquareIconSolid from "@heroicons/react/24/solid/ChartBarSquareIcon";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import ClipboardDocumentCheckIconSolid from "@heroicons/react/24/solid/ClipboardDocumentCheckIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";

import IMenuItem from "../types/IMenuItem";

import ViewSio from "@/pages/sis/ViewSio";

import LogSis from "@/pages/sis/LogSis";
import AssignPDC from "@/pages/sis/AssignPDC";
import ActionTaken from "@/pages/sis/ActionTaken";
import SioDashboard from "@/pages/sis/SioDashboard";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const SIS_MENU_LIST: IMenuItem[] = [
  {
    id: 5,
    name: "",
    icon: <ChartBarSquareIcon className="w-5 h-5" />,
    iconSelected: <ChartBarSquareIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "",
    element: <SioDashboard />,
    children: [],
    menuType: "Static",
  },
  {
    id: 4,
    name: "Dashboard",
    icon: <ChartBarSquareIcon className="w-5 h-5" />,
    iconSelected: <ChartBarSquareIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "dashboard",
    element: <SioDashboard />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 5,
    name: "Log SIO",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "log-sio",
    element: <LogSis />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 6,
    name: "View SIO",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "view-sio",
    element: <ViewSio />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 7,
    name: "Assign PDC",
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    iconSelected: <ClipboardDocumentCheckIconSolid className="w-5 h-5" />,
    appId: 1,
    path: "assign-pdc",
    element: <AssignPDC />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 8,
    name: "Action Taken",
    icon: <DocumentTextIcon className="w-5 h-5" />,
    iconSelected: <DocumentTextIconSolid className="w-5 h-5" />,
    appId: 1,
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
    appId: 1,
    path: "*",
    element: <PageNotFound />,
    children: [],
    menuType: "Static",
  },
];

export default SIS_MENU_LIST;
