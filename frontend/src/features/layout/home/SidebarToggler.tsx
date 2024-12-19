import React from "react";
import { shallowEqual } from "react-redux";
import {
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

import { IconButton } from "@/features/ui/buttons";
import { useLayoutConfig } from "../hooks";
import { useAppSelector } from "@/store/hooks";

interface IProps {
  mode?: string;
}

const defaultProps = {
  mode: "",
};

function SidebarToggler(props: IProps) {
  const { mode } = props;
  const layoutState = useAppSelector(({ layout }) => layout, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const layoutStatus = useLayoutConfig();
  const widthClass = layoutState.sidebarStatus ? "left-[294px]" : "left-[-5px]";
  const modeClass =
    mode === "FullScreen"
      ? `absolute z-[1] top-[35px] bg-[#9c9cb99c] hover:bg-[#3f4d67] text-blue-600 hover:text-white dark:text-white dark:bg-[#458282bf] hover:dark:bg-cyan-700  ${widthClass}`
      : "";
  const hiddenClass =
    mode && mode === "FullScreen" && globalState.appMode === "Normal"
      ? " hidden "
      : "";

  return (
    <IconButton
      onClick={() => {
        layoutStatus.toggleSidebar(!layoutState.sidebarStatus);
      }}
      className={`${modeClass} ${hiddenClass} text-white hover:text-white `}
      noBackground
    >
      {mode ? (
        <div>
          {layoutState.sidebarStatus ? (
            <ChevronDoubleLeftIcon className="w-2 h-4 " />
          ) : (
            <ChevronDoubleRightIcon className="w-2 h-4 " />
          )}
        </div>
      ) : (
        <Bars3Icon className="w-5 h-5 " />
      )}
    </IconButton>
  );
}

SidebarToggler.defaultProps = defaultProps;
export default SidebarToggler;
