import React from "react";
// import DarkThemeToggler from "@/features/theme/DarkThemeToggler";
import HelpToggler from "../HelpToggler";

function AuthHeader() {
  return (
    <div className="flex items-center justify-end p-2 px-4 dark:bg-gray-800">
      <div className="flex items-center justify-end gap-4 ">
        {/* <DarkThemeToggler /> */}
        <HelpToggler />
      </div>
    </div>
  );
}

export default AuthHeader;
