import React, { Suspense, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Outlet } from "react-router-dom";

import { BoxLoader } from "@/features/ui/loader";
import { useAppSelector } from "@/store/hooks";
import ErrorBoundary from "@/features/errorhandler/ErrorBoundary";
import AlertToast from "@/features/ui/alerts/AlertToast";
// import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import HomeSidebar from "./HomeSidebar";
import HomeApps from "./HomeApps";
import HomeSettings from "./HomeSettings";
import LoadingPage from "../LoadingPage";
import { useAccessConfig } from "@/features/authorization/hooks";
import SidebarToggler from "./SidebarToggler";
import MobileHomeHeader from "./MobileHomeHeader";

interface IProps {
  appId: number;
}
function HomeLayout(props: IProps) {
  const { appId } = props;
  const { setApp } = useAccessConfig();
  const layoutState = useAppSelector(({ layout }) => layout, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const toggleClass = layoutState.sidebarStatus
    ? "grid-cols-[auto_1fr]"
    : "grid-cols-[1fr]";
  const toggleAppModeClass =
    globalState.appMode === "Normal"
      ? "grid-rows-[auto_1fr_auto]"
      : "grid-rows-[1fr]";
  const visibleClass = layoutState.sidebarStatus ? "" : "hidden";
  useEffect(() => {
    setApp(appId);
  }, []);

  return (
    <>
      {/* <div
        className={`${toggleClass} md:grid hidden  w-[384px] h-[740px] overflow-hidden   box-border bg-[#f4f7fa]
    dark:bg-gradient-to-t dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 dark:bg-gray-900`}
      >
        <HomeSidebar />
        <div className={`${visibleClass} w-[300px]`} />
        <div
          className={`w-full h-full overflow-auto grid ${toggleAppModeClass} box-border`}
        >
          <HomeHeader />
          <div className="relative h-full overflow-hidden">
            <ErrorBoundary screen="Page" key={window.location.toString()}>
              <Suspense fallback={<LoadingPage hidden={false} />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>

            <HomeApps />
            <HomeSettings />
          </div>
          <HomeFooter />
        </div>

        <AlertToast />
        <BoxLoader />
        <SidebarToggler mode="FullScreen" />
        <HomeApps mode="FullScreen" />
        <HomeSettings mode="FullScreen" />
      </div> */}
      <div
        className={`${toggleClass}    h-full w-full  overflow-hidden  grid   box-border bg-[#f4f7fa]
    dark:bg-gradient-to-t dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 dark:bg-gray-900`}
      >
        <HomeSidebar />
        <div className={`${visibleClass} w-[300px]`} />
        <div
          className={`w-full h-full overflow-auto grid ${toggleAppModeClass} box-border`}
        >
          <MobileHomeHeader />
          <div className="h-full overflow-hidden ">
            <ErrorBoundary screen="Page" key={window.location.toString()}>
              <Suspense fallback={<LoadingPage hidden={false} />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>

            <HomeApps />
            <HomeSettings />
          </div>
          <HomeFooter />
        </div>

        <AlertToast />
        <BoxLoader />
        <SidebarToggler mode="FullScreen" />
        {/* <HomeApps mode="FullScreen" /> */}
        {/* <HomeSettings mode="FullScreen" /> */}
      </div>
    </>
  );
}

export default HomeLayout;
