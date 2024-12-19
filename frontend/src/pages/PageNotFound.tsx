import { FaceFrownIcon } from "@heroicons/react/24/outline";
import React from "react";

function PageNotFound() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[450px] flex flex-col gap-4 p-5 text-center shadow-md rounded-md bg-[#fcfdff96] dark:bg-gray-600">
        <div className="flex justify-center items-center text-center">
          <FaceFrownIcon className="h-12 w-12 text-orange-200" />
        </div>
        <h3 className="text-lg font-semibold text-sky-800 dark:text-teal-100 ">
          Page Not Found
        </h3>
        <p className="text-md font-normal text-gray-500 dark:text-slate-300">
          The Requested URL was not found on this server.
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
