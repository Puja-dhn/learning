import React from "react";
import { shallowEqual } from "react-redux";

import { useAppSelector } from "@/store/hooks";
import AppToggler from "./AppToggler";
import SidebarToggler from "./SidebarToggler";
import SettingToggler from "./SettingToggler";
import HomeToggler from "./HomeToggler";

function HomeHeader() {
  // const menuState = useAppSelector(({ menu }) => menu, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const hiddenClass =
    globalState.appMode === "Normal"
      ? "flex justify-between items-center"
      : "hidden";
  return (
    <div
      className={`h-[55px] ${hiddenClass} p-2 px-4 bg-[#362d65]  dark:bg-gray-800 shadow-md`}
    >
      <h2 className="flex items-center text-xl font-bold text-blue-900 md:text-2xl dark:text-blue-400 ">
        <SidebarToggler />
        {/* <span className="mx-4 text-[14px] font-medium text-center text-gray-500 dark:text-cyan-200">
          {menuState.name}
        </span> */}
      </h2>

      <div className="flex items-center gap-4 justify-evenly">
        <HomeToggler />
        <AppToggler />
        <SettingToggler />
      </div>
    </div>
  );
}

export default HomeHeader;
