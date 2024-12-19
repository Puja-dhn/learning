import React from "react";
import { shallowEqual } from "react-redux";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import { IconButton } from "@/features/ui/buttons";
import { useAppSelector } from "@/store/hooks";
import { useLayoutConfig } from "../hooks";

interface IProps {
  mode?: string;
}

const defaultProps = {
  mode: "",
};

function AppToggler(props: IProps) {
  const { mode } = props;
  const layoutState = useAppSelector(({ layout }) => layout, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const layoutStatus = useLayoutConfig();
  const appModeClass =
    globalState.appMode === "FullScreen"
      ? " absolute top-[10px] right-[10px] bg-gray-400 text-cyan-200 hover:text-blue-900 dark:text-white"
      : "";
  let visibleClass = "";

  if (mode === "FullScreen") {
    if (globalState.appMode !== "FullScreen") {
      visibleClass = " hidden";
    }
  }
  const handleAppsToggle = () => {
    if (mode === "FullScreen" && globalState.appMode === "FullScreen") {
      layoutStatus.setLayout({
        sidebarStatus: true,
        appStatus: !layoutState.appStatus,
        settingStatus: false,
        optionsMenuStatus: false,
      });
    } else {
      layoutStatus.toggleApp(!layoutState.appStatus);
    }
  };

  return (
    <IconButton
      onClick={handleAppsToggle}
      className={`${visibleClass} ${appModeClass} text-white hover:text-white`}
      noBackground
    >
      <Squares2X2Icon className="w-5 h-5 " />
    </IconButton>
  );
}

AppToggler.defaultProps = defaultProps;
export default AppToggler;
