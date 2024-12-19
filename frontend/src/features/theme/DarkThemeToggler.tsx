import React, { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useAppSelector } from "@/store/hooks";
import { useThemeConfig } from "./hooks";
import IconButton from "../ui/buttons/IconButton";

interface IProps {
  mode?: string;
  disableTabFocus?: boolean;
}

const defaultProps = {
  mode: "",
  disableTabFocus: false,
};
function DarkThemeToggler(props: IProps) {
  const { mode, disableTabFocus } = props;
  const themeState = useAppSelector(({ theme }) => theme, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const { toggleDarkTheme } = useThemeConfig();
  const appModeClass =
    mode === "FullScreen" && globalState.appMode === "FullScreen"
      ? " text-gray-300 bg-gray-500 hover:bg-gray-400"
      : "";
  useEffect(() => {
    if (themeState.isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [themeState]);
  return (
    <div>
      <IconButton
        disableTabFocus={disableTabFocus}
        onClick={() => {
          toggleDarkTheme({ isDarkMode: !themeState.isDarkMode });
        }}
        className={`${appModeClass}`}
      >
        {themeState.isDarkMode ? (
          <SunIcon className="h-5 w-5 " />
        ) : (
          <MoonIcon className="h-5 w-5 " />
        )}
      </IconButton>
    </div>
  );
}

DarkThemeToggler.defaultProps = defaultProps;
export default DarkThemeToggler;
