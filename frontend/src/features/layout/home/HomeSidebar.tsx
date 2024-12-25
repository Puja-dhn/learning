import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { twMerge } from "tailwind-merge";

import { APP_MENUS } from "@/features/authorization/menu-list";
import { useAppSelector } from "@/store/hooks";
import { IMenuItem } from "@/features/authorization/types";
import { getAllRouteList } from "@/features/authorization/utils";
import MenuItem from "@/features/authorization/MenuItem";
import HeaderLogo from "./HeaderLogo";
import AppModeToggler from "./AppModeToggler";
import SettingToggler from "./SettingToggler";
import HomeToggler from "./HomeToggler";

import LogoutButton from "@/features/authentication/LogoutButton";

function HomeSidebar() {
  const layoutState = useAppSelector(({ layout }) => layout, shallowEqual);
  const accessState = useAppSelector(({ access }) => access, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const [menuList, setMenuList] = useState<IMenuItem[]>([]);
  const visibleClass = layoutState.sidebarStatus ? "left-0 z-[3]" : " w-0 ";
  const appModeClass =
    globalState.appMode === "FullScreen"
      ? " grid-rows-[auto_1fr_auto] "
      : "grid-rows-[auto_1fr]";
  useEffect(() => {
    if (APP_MENUS) {
      const currMasterMenuList = APP_MENUS.filter(
        (item) => item.appId === accessState.appId,
      )[0].menuList.filter((item) => item.menuType === "Normal");
      const accessRouteList = getAllRouteList(
        accessState.menus,
        currMasterMenuList,
      );
      setMenuList(accessRouteList);
    }
  }, [accessState]);
  return (
    <div
      className={twMerge(
        `absolute top-0 h-full w-[300px] z-[2] bg-[#fff] text-[rgba(0, 0, 0, 0.87)] grid  transition-all ease-in-out delay-100 shadow-[1px_0_20px_0_#3f4d67] dark:shadow-md  dark:bg-gray-800 dark:border-r-[1px]  dark:border-gray-700 ${appModeClass}  ${visibleClass} `,
      )}
    >
      <HeaderLogo />
      <div className="h-full overflow-x-hidden overflow-y-auto">
        <ul>
          {menuList.map((menu) => (
            <li key={menu.id}>
              <MenuItem menuItem={menu} isChild={false} disableTabFocus />
            </li>
          ))}
        </ul>
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

export default HomeSidebar;
