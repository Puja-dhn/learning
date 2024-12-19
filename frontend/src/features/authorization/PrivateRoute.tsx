import React from "react";
import { Navigate } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { getLocalUser } from "../common/utils/local-storage";

function PrivateRoutes({ outlet }: { outlet: JSX.Element }) {
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const loggedUser = getLocalUser();

  const accesstoken =
    authState && authState.AUTH_TOKEN && loggedUser && loggedUser.AUTH_TOKEN
      ? loggedUser.AUTH_TOKEN
      : "";
  if (accesstoken !== "") {
    return outlet;
  }
  return globalState.loginType === "Domain" ? (
    <Navigate to="/auth/domain-login" />
  ) : (
    <Navigate to="/auth/scanner-login" />
  );
}

export default PrivateRoutes;
