import React from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { shallowEqual } from "react-redux";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import IconButton from "../ui/buttons/IconButton";
import { useAppSelector } from "@/store/hooks";
import { useLoaderConfig } from "../ui/hooks";
import { logout } from "./services/auth.service";

interface IProps {
  mode?: string;
  disableTabFocus?: boolean;
}

const defaultProps = {
  mode: "",
  disableTabFocus: false,
};
function LogoutButton(props: IProps) {
  const { mode, disableTabFocus } = props;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  let appModeClass = "";
  const loader = useLoaderConfig();
  if (mode === "FullScreen" && globalState.appMode === "FullScreen") {
    appModeClass =
      " absolute top-[10px] right-[10px] bg-gray-400 text-cyan-200 hover:text-blue-900 dark:text-white";
  }

  if (mode !== "FullScreen" && globalState.appMode === "FullScreen") {
    appModeClass = " text-gray-300 bg-gray-500 hover:bg-gray-400";
  }
  let visibleClass = "";

  if (mode === "FullScreen") {
    if (globalState.appMode !== "FullScreen") {
      visibleClass = " hidden";
    }
  }
  return (
    <IconButton
      disableTabFocus={disableTabFocus}
      onClick={() => {
        loader.show();
        logout(authState.ID).then(() => {
          localStorage.removeItem("user");
          sessionStorage.removeItem("persist:root");
          queryClient.invalidateQueries();
          navigate("/auth/domain-login", { replace: true });
          loader.hide();
        });
      }}
      className={`${visibleClass} ${appModeClass}`}
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 " />
    </IconButton>
  );
}

LogoutButton.defaultProps = defaultProps;
export default LogoutButton;
