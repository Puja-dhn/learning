import React, { useEffect } from "react";
import { shallowEqual } from "react-redux";
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import useAlertConfig from "../hooks/useAlertConfig";
import { useAppSelector } from "@/store/hooks";

const iconType = {
  success: {
    icon: InformationCircleIcon,
    iconLight: "text-green-500",
    iconDark: "dark:text-green-500",
    textLight: "text-green-700",
    textDark: "dark:text-green-700",
    bgLight: "bg-green-100",
    bgDark: "dark:bg-green-100",
    hover: "hover:bg-green-200",
  },
  info: {
    icon: InformationCircleIcon,
    iconLight: "text-blue-500",
    iconDark: "dark:text-blue-500",
    textLight: "text-blue-700",
    textDark: "dark:text-blue-700",
    bgLight: "bg-blue-100",
    bgDark: "dark:bg-blue-100",
    hover: "hover:bg-blue-200",
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconLight: "text-amber-500",
    iconDark: "dark:text-amber-500",
    textLight: "text-amber-700",
    textDark: "dark:text-amber-700",
    bgLight: "bg-amber-100",
    bgDark: "dark:bg-amber-100",
    hover: "hover:bg-amber-200",
  },
  error: {
    icon: ExclamationCircleIcon,
    iconLight: "text-red-500",
    iconDark: "dark:text-red-500",
    textLight: "text-red-700",
    textDark: "dark:text-red-700",
    bgLight: "bg-red-100",
    bgDark: "dark:bg-red-100",
    hover: "hover:bg-red-200",
  },
};

function AlertToast() {
  const alertToast = useAlertConfig();
  const alertState = useAppSelector(({ alert }) => alert, shallowEqual);

  const IconElement = iconType[alertState.severity].icon;
  const iconColor = `${iconType[alertState.severity].iconLight} ${
    iconType[alertState.severity].iconDark
  }`;
  const textColor = `${iconType[alertState.severity].textLight} ${
    iconType[alertState.severity].textDark
  }`;
  const bgColor = `${iconType[alertState.severity].bgLight} ${
    iconType[alertState.severity].bgDark
  }`;
  const hoverColor = `${iconType[alertState.severity].hover}`;
  const visibleClass = alertState.status ? "bottom-20" : "-bottom-20 hidden";

  useEffect(() => {
    if (alertState.status && alertState.autoClose) {
      setTimeout(() => {
        alertToast.hide();
      }, alertState.autoCloseTime);
    }
  }, [alertState]);

  return (
    <div
      className={`absolute ${visibleClass} z-20  left-1/2 -translate-x-1/2 flex items-center gap-2 p-3 transition-all ease-in-out delay-150 w-full max-w-sm md:max-w-md lg:max-w-lg shadow-md  ${bgColor}  ${textColor}`}
    >
      <div className={`${iconColor} `}>
        <IconElement className="w-6 h-6" />
      </div>
      <div className={`mr-auto text-sm font-normal ${textColor}`}>
        {alertState.message}
      </div>
      <button
        type="button"
        className={`ml-2 p-1 rounded-lg ${hoverColor} ${iconColor}`}
        onClick={() => {
          alertToast.hide();
        }}
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default AlertToast;
