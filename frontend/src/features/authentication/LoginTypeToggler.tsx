import React from "react";
import { useNavigate } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";

import { UserGroupIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import IconButton from "../ui/buttons/IconButton";
import { useAppSelector } from "@/store/hooks";

function LoginTypeToggler() {
  const { t } = useTranslation(["common", "authentication"]);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const navigate = useNavigate();
  return (
    <IconButton
      className="px-4 py-2.5"
      onClick={() => {
        if (globalState.loginType === "Domain") {
          navigate("/auth/scanner-login", { replace: true });
        } else {
          navigate("/auth/domain-login", { replace: true });
        }
      }}
    >
      {globalState.loginType === "Domain" ? (
        <CreditCardIcon className="w-5 h-5 " />
      ) : (
        <UserGroupIcon className="w-5 h-5 " />
      )}
      <span className="hidden sm:inline">
        {globalState.loginType === "Domain"
          ? t("buttons.sign_in_scanner", { ns: "authentication" })
          : t("buttons.sign_in_domain", { ns: "authentication" })}
      </span>
    </IconButton>
  );
}

export default LoginTypeToggler;
