import React from "react";
// import { shallowEqual } from "react-redux";

// import { ASSET_BASE_URL } from "@/features/common/constants";
// import { useAppSelector } from "@/store/hooks";
import AppLogo from "@/assets/images/logotext.png";

function HeaderLogo() {
  // const accessState = useAppSelector(({ access }) => access, shallowEqual);
  // const currAppId = accessState.appId;
  // const currApp = accessState.apps.filter((app) => app.ID === currAppId);
  // const currAppName = currApp.length > 0 ? currApp[0].NAME : "Safety App";
  // const currAppLogoPath =
  //   currApp.length > 0 ? currApp[0].LOGO_PATH : "3_app_logo.png";
  return (
    <div className="h-[55px] flex flex-col justify-between  mb-2 bg-white  border-b-[1px] border-gray-600">
      <div className="relative">
        <img
          src={AppLogo}
          alt="InSHE App"
          className="h-[45px] w-[185px] absolute top-[50%] left-[16%]   "
        />
        {/* <img
          src={`${ASSET_BASE_URL}/images/logo/${currAppLogoPath}`}
          alt={currAppName}
          width="60"
        /> */}
      </div>
      {/* <div className="w-full flex items-center justify-center overflow-hidden border-t-[1px] border-b-[1px] border-gray-600  p-4">
        <span className="text-lg font-bold text-transparent bg-gradient-to-br from-gray-100 to-cyan-400 bg-clip-text dark:from-gray-100 dark:to-cyan-400">
          Safety Reporting
        </span>
      </div> */}
    </div>
  );
}

export default HeaderLogo;
