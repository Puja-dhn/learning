import React from "react";
import { shallowEqual } from "react-redux";

import { useAppSelector } from "@/store/hooks";
import SidebarToggler from "./SidebarToggler";
import OptionsToggler from "./OptionsToggler";

function MobileHomeHeader() {
  const menuState = useAppSelector(({ menu }) => menu, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const hiddenClass =
    globalState.appMode === "Normal"
      ? "flex justify-between items-center"
      : "hidden";
  return (
    <div
      className={`h-[55px] ${hiddenClass} p-2 px-4 bg-[#06235b]  dark:bg-gray-800 shadow-md`}
    >
      <h2 className="flex items-center text-xl font-bold text-blue-900 md:text-2xl dark:text-blue-400 ">
        <SidebarToggler />
        <span className=" text-[14px] font-medium text-center text-white dark:text-cyan-200">
          {menuState.name}
        </span>
      </h2>

      <div className="flex items-center gap-2 justify-evenly">
        <OptionsToggler />
      </div>
    </div>
  );
}

export default MobileHomeHeader;
