import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import {
  getCurrentTimer,
  tickTimer,
} from "@/features/common/utils/local-storage";
import { SOCKET_BASE_URL } from "../common/constants";

function LogoutTimer() {
  const [logoutTimer, setLogoutTimer] = useState(getCurrentTimer());
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    const newSocket = io(SOCKET_BASE_URL, {
      path: "/ns-websocket",
      transports: ["websocket"],
    });

    newSocket.on("NEW_LOGIN", (newMessage) => {
      const socketData = JSON.parse(newMessage);
      const { id } = socketData;
      if (+authState.ID === +id) {
        const lastLoginType = globalState.loginType;
        localStorage.removeItem("user-inshe");
        localStorage.removeItem("reloadcounter-inshe");
        localStorage.removeItem("loggedin-inshe");
        sessionStorage.removeItem("persist:root-inshe");
        queryClient.invalidateQueries();
        navigate(
          lastLoginType === "Domain"
            ? "/auth/domain-login"
            : "/auth/scanner-login",
          { replace: true },
        );
      }
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    let interval: any = null;
    if (logoutTimer > 0) {
      interval = setInterval(() => {
        tickTimer();
        setLogoutTimer(getCurrentTimer());
      }, 60000);
    } else if (logoutTimer <= 0) {
      clearInterval(interval);
      const lastLoginType = globalState.loginType;
      localStorage.removeItem("user-inshe");
      localStorage.removeItem("reloadcounter-inshe");
      localStorage.removeItem("loggedin-inshe");
      sessionStorage.removeItem("persist:root-inshe");
      queryClient.invalidateQueries();
      navigate(
        lastLoginType === "Domain"
          ? "/auth/domain-login"
          : "/auth/scanner-login",
        { replace: true },
      );
    }
    return () => clearInterval(interval);
  }, [logoutTimer]);
  const colorClass = logoutTimer <= 2 ? "text-red-500" : "";
  return (
    <p className="text-xs font-medium text-gray-400">
      Auto Logout In{" "}
      <span className={`${colorClass} font-bold`}>{logoutTimer}</span> Minutes
    </p>
  );
}

export default LogoutTimer;
