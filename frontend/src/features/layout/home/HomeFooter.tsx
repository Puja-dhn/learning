import React from "react";
import { shallowEqual } from "react-redux";
import LogoutTimer from "@/features/authentication/LogoutTimer";
import { useAppSelector } from "@/store/hooks";
import HelpToggler from "../HelpToggler";

function HomeFooter() {
  const date = new Date();
  const year = date.getFullYear();

  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const hiddenClass =
    globalState.appMode === "Normal"
      ? "flex justify-between items-center"
      : "hidden";
  return (
    <div
      className={`${hiddenClass} p-2 px-4 md:flex hidden dark:bg-gray-800 shadow-md dark:text-gray-300`}
    >
      <div className="text-xs text-gray-400">
        Copyright © {year} : ABC Infotech Pvt. Ltd..{" "}
      </div>
      <div className="flex items-center justify-center">
        <div className="pr-8">
          <LogoutTimer />
        </div>
        <div className="absolute bottom-0 right-3">{/* <HelpToggler /> */}</div>
      </div>
    </div>
  );
}

export default HomeFooter;
