import React from "react";
import { shallowEqual } from "react-redux";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";
import { useAppSelector } from "@/store/hooks";
import { useLayoutConfig } from "../hooks";
import { useGlobalConfig } from "@/features/common/hooks";
import { IconButton } from "@/features/ui/buttons";

interface IProps {
  disableTabFocus?: boolean;
}

const defaultProps = {
  disableTabFocus: false,
};
function AppModeToggler(props: IProps) {
  const { disableTabFocus } = props;
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const { setAppMode } = useGlobalConfig();
  const { toggleSetting } = useLayoutConfig();
  const appModeClass =
    globalState.appMode === "FullScreen"
      ? "  bg-gray-400 text-cyan-200 hover:text-blue-900 dark:text-white "
      : "";
  return (
    <div>
      <IconButton
        disableTabFocus={disableTabFocus}
        onClick={() => {
          setAppMode(
            globalState.appMode === "Normal" ? "FullScreen" : "Normal",
          );
          toggleSetting(false);
        }}
        className={`pr-4  ${appModeClass}`}
      >
        {globalState.appMode === "Normal" ? (
          <>
            <ArrowsPointingOutIcon className="h-5 w-5 " />
            <p className="font-normal">Full Screen</p>
          </>
        ) : (
          <>
            <ArrowsPointingInIcon className="h-5 w-5 " />
            <p className="font-normal">Normal</p>
          </>
        )}
      </IconButton>
    </div>
  );
}

AppModeToggler.defaultProps = defaultProps;
export default AppModeToggler;
