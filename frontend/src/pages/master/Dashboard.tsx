import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual } from "react-redux";

import {
  useAccessConfig,
  useAppAccessQuery,
  useMenuConfig,
} from "@/features/authorization/hooks";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";

import AppList from "@/features/layout/home/AppList";

import { useAppSelector } from "@/store/hooks";
import { APP_MENUS } from "@/features/authorization/menu-list";

function Dashboard() {
  const { t } = useTranslation(["common", "authentication"]);
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const { setAppAccess } = useAccessConfig();
  const { setSelMenu } = useMenuConfig();
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const {
    data: appAccessData,
    isLoading: isAppAccessDataLoading,
    isError: isAppAccessDataError,
  } = useAppAccessQuery(authState.ID);

  useEffect(() => {
    if (isAppAccessDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isAppAccessDataLoading && isAppAccessDataError) {
      alertToast.show(
        "error",
        "Error Fetching data from API. Try again.",
        true,
      );
    }

    if (!isAppAccessDataLoading && appAccessData) {
      const currAppData = APP_MENUS.filter((item) => item.appId === 0)[0];
      const currDashboardMenu = currAppData.menuList[0];
      setAppAccess(appAccessData);
      setSelMenu(currDashboardMenu);
    }
  }, [appAccessData, isAppAccessDataLoading, isAppAccessDataError]);
  return (
    <div className="items-start justify-start w-full h-full p-6 overflow-auto md:flex">
      <AppList screenType="Dashboard" />
    </div>
  );
}

export default Dashboard;
