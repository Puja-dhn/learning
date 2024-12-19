import React from "react";
import { shallowEqual } from "react-redux";

import { useAppSelector } from "@/store/hooks";

function UserDashboard() {
  const globalState = useAppSelector(({ global }) => global, shallowEqual);

  const appModePaddingClass =
    globalState.appMode === "FullScreen" ? "p-0 px-2.5 " : " p-2.5  pb-0 ";

  return (
    <div
      className={`relative w-full h-full grid grid-rows-[auto_1fr] ${appModePaddingClass} gap-2.5  overflow-auto `}
    >
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-start gap-2">
          <div>Dashboard</div>
        </div>
      </div>

      <div className="h-full w-full overflow-auto border-[1px] dark:border-gray-700">
        dashboard
      </div>
    </div>
  );
}

export default UserDashboard;
