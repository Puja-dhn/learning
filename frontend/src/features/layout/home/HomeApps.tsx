import React from "react";
import { shallowEqual } from "react-redux";
import { twMerge } from "tailwind-merge";

import AppList from "./AppList";
import { useAppSelector } from "@/store/hooks";
import SettingToggler from "./SettingToggler";
import AppModeToggler from "./AppModeToggler";
import HomeToggler from "./HomeToggler";
import LogoutButton from "@/features/authentication/LogoutButton";

interface IProps {
  mode?: string;
}

const defaultProps = {
  mode: "",
};
function HomeApps(props: IProps) {
  const { mode } = props;
  const layoutState = useAppSelector(({ layout }) => layout, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);

  let visibleClass = layoutState.appStatus
    ? "right-0 z-[3]"
    : "relative -right-[300px] w-0  ";
  if (mode === "FullScreen") {
    if (globalState.appMode === "FullScreen") {
      visibleClass = layoutState.appStatus
        ? "left-0 z-[3]"
        : "left-[-300px] w-0  ";
    } else {
      visibleClass = "left-[-300px] w-0  ";
    }
  }

  if (mode !== "FullScreen") {
    if (globalState.appMode === "FullScreen") {
      visibleClass = "relative -right-[300px] w-0  ";
    }
  }

  const appModeClass =
    globalState.appMode === "FullScreen"
      ? " grid-rows-[auto_1fr_auto] bg-[#3f4d67] border-none "
      : "grid-rows-[auto_1fr]";

  const appModeHeadClass =
    globalState.appMode === "FullScreen"
      ? " justify-center text-center text-gray-300 p-2"
      : "";

  return (
    <div
      className={twMerge(
        `absolute grid  top-0 h-full w-[300px] transition-all ease-in-out delay-100 shadow-md bg-white dark:bg-gray-700 border-l-[1px] border-t-[1px]  dark:border-gray-600 ${appModeClass} ${visibleClass}`,
      )}
    >
      <div
        className={twMerge(
          `w-full flex justify-between items-center gap-2 p-2 shadow-md  ${appModeHeadClass}`,
        )}
      >
        <h3
          className={twMerge(
            `text-md font-semibold text-gray-600 dark:text-gray-300 pl-2.5 ${appModeHeadClass}`,
          )}
        >
          Apps
        </h3>
      </div>
      <div className="h-full overflow-auto p-2.5 ">
        <AppList screenType="Popup" disableTabFocus />
      </div>
      {globalState.appMode === "FullScreen" && (
        <div className="flex justify-evenly items-center p-2.5">
          <SettingToggler mode="FullScreen" disableTabFocus />
          <AppModeToggler disableTabFocus />
        </div>
      )}
      <HomeToggler mode="FullScreen" disableTabFocus />
      <LogoutButton mode="FullScreen" disableTabFocus />
    </div>
  );
}

HomeApps.defaultProps = defaultProps;
export default HomeApps;
