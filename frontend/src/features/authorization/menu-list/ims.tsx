import React from "react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentPlusIconSolid from "@heroicons/react/24/solid/DocumentPlusIcon";

import IMenuItem from "../types/IMenuItem";

import LogPtw from "@/pages/ptw/LogPtw";
import ViewPtw from "@/pages/ptw/ViewPtw";
import ApprovePtw from "@/pages/ptw/ApprovePtw";
import LogIms from "@/pages/ims/LogIms";

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));

const IMS_MENU_LIST: IMenuItem[] = [
  {
    id: 11,
    name: "",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 4,
    path: "",
    element: <LogIms />,
    children: [],
    menuType: "Static",
  },
  {
    id: 11,
    name: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
    iconSelected: <HomeIconSolid className="w-5 h-5" />,
    appId: 4,
    path: "dashboard",
    element: <LogIms />,
    children: [],
    menuType: "Normal",
  },
  {
    id: 11,
    name: "Log IMS",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    iconSelected: <DocumentPlusIconSolid className="w-5 h-5" />,
    appId: 4,
    path: "log-ims",
    element: <LogIms />,
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

export default IMS_MENU_LIST;
