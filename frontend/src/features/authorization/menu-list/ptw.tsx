import React from "react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentPlusIconSolid from "@heroicons/react/24/solid/DocumentPlusIcon";

import ChartBarSquareIconSolid from "@heroicons/react/24/solid/ChartBarSquareIcon";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import ClipboardDocumentCheckIconSolid from "@heroicons/react/24/solid/ClipboardDocumentCheckIcon";
import DocumentMagnifyingGlassIconSolid from "@heroicons/react/24/solid/DocumentMagnifyingGlassIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import IMenuItem from "../types/IMenuItem";
import LogPtw from "@/pages/ptw/LogPtw";
import ViewPtw from "@/pages/ptw/ViewPtw";
import ApprovePtw from "@/pages/ptw/ApprovePtw";
import LogViolations from "@/pages/ptw/LogViolations";
import ViewViolations from "@/pages/ptw/ViewViolations";
import CloseViolations from "@/pages/ptw/CloseViolations";
import ClosePtw from "@/pages/ptw/ClosePtw";
import PtwDashboard from "@/pages/ptw/PtwDashboard";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const PTW_MENU_LIST: IMenuItem[] = [
  {
    id: 10,
    name: "",
    icon: <ChartBarSquareIcon className="w-5 h-5" />,
    iconSelected: <ChartBarSquareIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "",
    element: <PtwDashboard />,
    children: [],
    menuType: "Static",
  },
  {
    id: 9,
    name: "Dashboard",
    icon: <ChartBarSquareIcon className="w-5 h-5" />,
    iconSelected: <ChartBarSquareIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "dashboard",
    element: <PtwDashboard />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 10,
    name: "Log Permit",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "log-ptw",
    element: <LogPtw />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 11,
    name: "View Permit",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "view-ptw",
    element: <ViewPtw />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 12,
    name: "Approve Permit",
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    iconSelected: <ClipboardDocumentCheckIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "approve-ptw",
    element: <ApprovePtw />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 13,
    name: "Clsoe Permit",
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    iconSelected: <ClipboardDocumentCheckIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "close-ptw",
    element: <ClosePtw />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 14,
    name: "Log Permit Violations",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "log-violations",
    element: <LogViolations />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 15,
    name: "View Permit Violations",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 2,
    path: "view-violations",
    element: <ViewViolations />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 16,
    name: "Close Permit Violations",
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    iconSelected: <ClipboardDocumentCheckIconSolid className="w-5 h-5" />,
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
