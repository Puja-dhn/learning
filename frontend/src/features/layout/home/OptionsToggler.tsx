import React, { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";

import {
  ArrowRightOnRectangleIcon,
  EllipsisVerticalIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { IconButton } from "@/features/ui/buttons";
import { useAppSelector } from "@/store/hooks";
import { useLayoutConfig } from "../hooks";
import { logout } from "@/features/authentication/services/auth.service";
import { useLoaderConfig } from "@/features/ui/hooks";

interface IProps {
  mode?: string;
  disableTabFocus?: boolean;
}

const defaultProps = {
  mode: "",
  disableTabFocus: false,
};

function OptionsToggler(props: IProps) {
  const { mode, disableTabFocus } = props;
  const layoutState = useAppSelector(({ layout }) => layout, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const layoutStatus = useLayoutConfig();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const loader = useLoaderConfig();

  const ref = useRef<HTMLDivElement>(null);

  const appModeClass =
    globalState.appMode === "FullScreen"
      ? "  bg-gray-400 text-cyan-200 hover:text-blue-900 dark:text-white "
      : "";
  const refLayout = useRef(false);
  useEffect(() => {
    refLayout.current = layoutState.sidebarStatus;
  }, [layoutState.sidebarStatus]);
  const handleOptionsToggle = () => {
    layoutStatus.setLayout({
      sidebarStatus: refLayout.current,
      appStatus: layoutState.appStatus,
      settingStatus: layoutState.settingStatus,
      optionsMenuStatus: !layoutState.optionsMenuStatus,
    });
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      layoutStatus.setLayout({
        sidebarStatus: layoutState.sidebarStatus,
        appStatus: layoutState.appStatus,
        settingStatus: layoutState.settingStatus,
        optionsMenuStatus: false,
      });
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleClickOutside(e);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [
    layoutState.optionsMenuStatus,
    layoutStatus,
    refLayout,
    layoutState.appStatus,
    layoutState.settingStatus,
  ]);

  return (
    <div ref={ref}>
      <IconButton
        disableTabFocus={disableTabFocus}
        onClick={handleOptionsToggle}
        className={` ${appModeClass} text-white hover:text-white`}
        noBackground
      >
        <EllipsisVerticalIcon className="w-5 h-5 " />
        {mode === "FullScreen" && globalState.appMode === "FullScreen" && (
          <p className="font-normal pr-2.5">Options</p>
        )}
      </IconButton>
      <div
        className={`bg-gray-100  w-24 absolute right-[5px] top-12 z-10 shadow-md border border-gray-200 rounded-sm  ${
          layoutState.optionsMenuStatus ? "block" : "hidden"
        }`}
      >
        <div className="p-2 font-normal text-[#06235b] hover:bg-slate-50">
          <button
            onClick={() => {
              navigate("/master", { replace: true });
            }}
            type="button"
            className="w-[100%] text-[11px] cursor-pointer flex gap-2 font-bold"
          >
            <HomeIcon className="w-5 h-4 " /> Home
          </button>
        </div>
        <div className="p-2 font-normal text-[#06235b] hover:bg-slate-50">
          <button
            type="button"
            onClick={() => {
              loader.show();
              logout(authState.ID).then(() => {
                layoutStatus.setLayout({
                  sidebarStatus: refLayout.current,
                  appStatus: layoutState.appStatus,
                  settingStatus: layoutState.settingStatus,
                  optionsMenuStatus: !layoutState.optionsMenuStatus,
                });
                localStorage.removeItem("user");
                sessionStorage.removeItem("persist:root");
                queryClient.invalidateQueries();
                navigate("/auth/domain-login", { replace: true });
                loader.hide();
              });
            }}
            className="w-[100%] text-[11px] cursor-pointer flex gap-2 font-bold"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-4 " />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

OptionsToggler.defaultProps = defaultProps;
export default OptionsToggler;
