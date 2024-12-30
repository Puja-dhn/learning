import React from "react";
import { useNavigate } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { twMerge } from "tailwind-merge";
import { HomeIcon } from "@heroicons/react/24/outline";

import { APP_MENUS } from "@/features/authorization/menu-list";
import { IconButton } from "@/features/ui/buttons";
import { useMenuConfig, useAccessConfig } from "@/features/authorization/hooks";
import { useAppSelector } from "@/store/hooks";

interface IProps {
  mode?: string;
  disableTabFocus?: boolean;
  hasLabel?: boolean;
  className?: string;
}

const defaultProps = {
  mode: "",
  disableTabFocus: false,
  hasLabel: false,
  className: "",
};

function HomeToggler(props: IProps) {
  const { mode, disableTabFocus, hasLabel, className } = props;
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const { setSelMenu } = useMenuConfig();
  const { setApp } = useAccessConfig();
  const navigate = useNavigate();
  const appModeClass =
    globalState.appMode === "FullScreen"
      ? " absolute top-[10px] left-[10px] bg-gray-400 text-cyan-200 hover:text-blue-900 dark:text-white"
      : "";
  let visibleClass = "";

  if (mode === "FullScreen") {
    if (globalState.appMode !== "FullScreen") {
      visibleClass = " hidden";
    }
  }
  const handleAppHome = () => {
    const currAppData = APP_MENUS.filter((item) => item.appId === 0)[0];
    const currDashboardMenu = currAppData.menuList[0];
    setApp(0);
    setSelMenu(currDashboardMenu);
    navigate(`/${currAppData.routeMaster}/${currDashboardMenu.path}`, {
      replace: true,
    });
  };

  return (
    <IconButton
      disableTabFocus={disableTabFocus}
      onClick={handleAppHome}
      className={twMerge(
        `${visibleClass} ${appModeClass} ${className} text-white hover:text-white`,
      )}
      noBackground
    >
      <HomeIcon className="w-5 h-5 " />
      {hasLabel && <p className="font-semibold">Go to Home</p>}
    </IconButton>
  );
}

HomeToggler.defaultProps = defaultProps;
export default HomeToggler;
