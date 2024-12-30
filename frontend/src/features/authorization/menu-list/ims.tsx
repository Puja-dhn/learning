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
import { UserGroupIcon } from "@heroicons/react/24/outline";
import IMenuItem from "../types/IMenuItem";
import LogIms from "@/pages/ims/LogIms";
import ViewIms from "@/pages/ims/ViewIms";
import TeamFormation from "@/pages/ims/TeamFormation";
import CloseIncident from "@/pages/ims/CloseIncident";
import CategorizeIncident from "@/pages/ims/CategorizeIncident";
import IncidentInvestigation from "@/pages/ims/IncidentInvestigation";
import CloseRecommendation from "@/pages/ims/CloseRecommendation";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const IMS_MENU_LIST: IMenuItem[] = [
  {
    id: 18,
    name: "",
    icon: <ChartBarSquareIcon className="w-5 h-5" />,
    iconSelected: <ChartBarSquareIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "",
    element: <LogIms />,
    children: [],
    menuType: "Static",
  },
  {
    id: 17,
    name: "Dashboard",
    icon: <ChartBarSquareIcon className="w-5 h-5" />,
    iconSelected: <ChartBarSquareIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "dashboard",
    element: <LogIms />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 18,
    name: "Log Incident",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "log-ims",
    element: <LogIms />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 19,
    name: "View Incident",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    iconSelected: <DocumentMagnifyingGlassIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "view-ims",
    element: <ViewIms />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 20,
    name: "Team Formation",
    icon: <UserGroupIcon className="w-5 h-5" />,
    iconSelected: <UserGroupIcon className="w-5 h-5" />,
    appId: 3,
    path: "team-formation",
    element: <TeamFormation />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 21,
    name: "Incident Categorization",
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    iconSelected: <ClipboardDocumentCheckIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "incident-categorization",
    element: <CategorizeIncident />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 22,
    name: "Investigation",
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    iconSelected: <ClipboardDocumentCheckIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "incident-investigation",
    element: <IncidentInvestigation />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 23,
    name: "Close Incident",
    icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
    iconSelected: <ClipboardDocumentCheckIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "close-incident",
    element: <CloseIncident />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 24,
    name: "Recomm. Closure",
    icon: <UserGroupIcon className="w-5 h-5" />,
    iconSelected: <UserGroupIcon className="w-5 h-5" />,
    appId: 3,
    path: "close-recommendation",
    element: <CloseRecommendation />,
    children: [],
    menuType: "Normal",
  },

  {
    id: 0,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 3,
    path: "*",
    element: <PageNotFound />,
    children: [],
    menuType: "Static",
  },
];

export default IMS_MENU_LIST;
