import React from "react";
import { Outlet } from "react-router-dom";

import AlertToast from "@/features/ui/alerts/AlertToast";

// import AuthHeader from "./AuthHeader";
import BoxLoader from "@/features/ui/loader/BoxLoader";

// bg-gradient-to-tr from-blue-300 via-white to-teal-100
// bg-gradient-to-r from-indigo-100 via-violet-100 to-purple-100
// bg-gradient-to-r from-blue-100 via-indigo-100 to-violet-100
// bg-gradient-to-br from-rose-100 to-teal-100
function AuthLayout() {
  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className="w-full h-full overflow-hidden grid grid-rows-[1fr] box-border       
      
      dark:bg-gradient-to-t dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 dark:bg-gray-900"
      >
        {/* <AuthHeader /> */}
        <Outlet />
        {/* <AuthFooter /> */}
      </div>
      <AlertToast />
      <BoxLoader />
    </div>
  );
}

export default AuthLayout;
