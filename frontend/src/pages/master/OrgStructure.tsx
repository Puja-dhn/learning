import { FaceFrownIcon } from "@heroicons/react/24/outline";
import React from "react";

function OrgStructure() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[450px] flex flex-col gap-4 p-5 text-center shadow-md rounded-md bg-[#fcfdff96] dark:bg-gray-600">
        <div className="flex items-center justify-center text-center">
          <FaceFrownIcon className="w-12 h-12 text-orange-200" />
        </div>
        <h3 className="text-lg font-semibold text-sky-800 dark:text-teal-100 ">
          Page Not Found
        </h3>
        <p className="font-normal text-gray-500 text-md dark:text-slate-300">
          The Requested URL was not found on this server.
        </p>
      </div>
    </div>
  );
}

export default OrgStructure;
