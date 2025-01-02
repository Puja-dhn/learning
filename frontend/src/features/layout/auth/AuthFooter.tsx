import React from "react";

function AuthFooter() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className="items-end justify-between hidden p-2 px-4 md:flex dark:bg-gray-800 dark:text-gray-300">
      <div className="text-xs text-gray-400">
        Copyright © {year} : ABC Infotech Pvt. Ltd.{" "}
      </div>
    </div>
  );
}

export default AuthFooter;
