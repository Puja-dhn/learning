import React from "react";
import { shallowEqual } from "react-redux";
import { twMerge } from "tailwind-merge";

import { ASSET_BASE_URL } from "@/features/common/constants";
// import { MASTER_MENU_LIST } from "@/features/authorization/menu-list";
import { useAppSelector } from "@/store/hooks";
// import LanguageSelector from "@/features/localization/LanguageSelecter";
// import DarkThemeToggler from "@/features/theme/DarkThemeToggler";
import LogoutButton from "@/features/authentication/LogoutButton";
// import MenuItem from "@/features/authorization/MenuItem";
import AppModeToggler from "./AppModeToggler";
import SettingToggler from "./SettingToggler";
import HomeToggler from "./HomeToggler";

interface IProps {
  mode?: string;
}

const defaultProps = {
  mode: "",
};
function HomeSettings(props: IProps) {
  const { mode } = props;
  const layoutState = useAppSelector(({ layout }) => layout, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  let visibleClass = layoutState.settingStatus
    ? "right-0 z-[3]"
    : "relative -right-[300px] w-0  ";
  if (mode === "FullScreen") {
    if (globalState.appMode === "FullScreen") {
      visibleClass = layoutState.settingStatus
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
    globalState.appMode === "FullScreen" ? " bg-[#3f4d67] border-none" : "";

  const appModeImgClass =
    globalState.appMode === "FullScreen" ? " bg-transparent " : "";
  const appModeProfileClass =
    globalState.appMode === "FullScreen" ? " text-cyan-100 " : "";
  return (
    <div
      className={twMerge(
        `absolute  top-0 h-full w-[300px] grid grid-rows-[1fr_auto] transition-all ease-in-out delay-100 shadow-md  bg-white dark:bg-gray-700 border-l-[1px] border-t-[1px]  dark:border-gray-600  ${appModeClass} ${visibleClass} `,
      )}
    >
      <div
        className={twMerge(
          `h-full flex flex-col pt-8 justify-start items-center bg-white dark:bg-gray-700 ${appModeImgClass}`,
        )}
      >
        <img
          className="h-[120px] w-[120px] rounded-full"
          src={`${ASSET_BASE_URL}/images/profile/${
            authState.PHOTO_PATH
              ? authState.PHOTO_PATH
              : "profile_photo_default.png"
          }`}
          alt="profile"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = `${ASSET_BASE_URL}/images/profile/profile_photo_default.png`;
          }}
        />
        <h3
          className={twMerge(
            `pt-2.5 text-lg font-bold text-center text-blue-900  dark:text-cyan-100 ${appModeProfileClass}`,
          )}
        >
          {authState.NAME}
        </h3>
        <p className="p-2 pb-4 text-xs font-semibold text-center text-gray-400">
          Employee Id - <span>{authState.ID}</span>
        </p>

        <div className="w-full p-2.5 flex flex-row justify-evenly items-center gap-2 border-t-[1px] border-b-[1px] border-gray-300 dark:border-gray-500">
          {/* <DarkThemeToggler mode="FullScreen" disableTabFocus /> */}
          {/* <LanguageSelector mode="FullScreen" disableTabFocus /> */}
          <LogoutButton disableTabFocus />
        </div>
        {/* <MenuItem
          menuItem={MASTER_MENU_LIST.filter((item) => item.id === 1)[0]}
          isChild={false}
          disableTabFocus
        /> */}
      </div>
      {globalState.appMode === "FullScreen" ? (
        <div className="flex justify-evenly items-center p-2.5">
          <SettingToggler mode="FullScreen" disableTabFocus />
          <AppModeToggler disableTabFocus />
        </div>
      ) : (
        <div className="flex justify-evenly items-center p-2.5">
          <AppModeToggler disableTabFocus />
        </div>
      )}
      <HomeToggler mode="FullScreen" disableTabFocus />
      <LogoutButton mode="FullScreen" disableTabFocus />
    </div>
  );
}
HomeSettings.defaultProps = defaultProps;
export default HomeSettings;
