import React, { useCallback, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import IconButton from "../buttons/IconButton";
import Button from "../buttons/Button";

interface IProps {
  heading: string;
  children: React.ReactNode;
  onClose: () => void;
  openStatus: boolean;
  hasSubmit?: boolean;
  onSubmit?: () => void;
  size?: "small" | "medium" | "large" | "fullscreen";
  showError?: boolean;
  hasError?: boolean;
  onReset?: () => void;
  hasReset?: boolean;
  onDelete?: () => void;
  hasDelete?: boolean;
  hasFooter?: boolean;
  errorMsg?: string;
}

const defaultProps = {
  onSubmit: () => null,
  hasSubmit: false,
  size: "medium",
  showError: false,
  hasError: false,
  onReset: () => null,
  hasReset: false,
  onDelete: () => null,
  hasDelete: false,
  hasFooter: true,
  errorMsg: "",
};

function ModalPopup(props: IProps) {
  const {
    heading,
    children,
    onClose,
    openStatus,
    hasSubmit,
    onSubmit,
    size,
    showError,
    hasError,
    onReset,
    hasReset,
    onDelete,
    hasDelete,
    hasFooter,
    errorMsg,
  } = props;
  const openClass = openStatus ? "flex" : "hidden";
  let sizeClass = "w-[400px] max-w-[95%] max-h-[80%]";
  switch (size) {
    case "medium": {
      sizeClass = "w-[640px] max-w-[95%] max-h-[80%]";
      break;
    }
    case "large": {
      sizeClass = "w-[1024px] max-w-[95%] max-h-[80%]";
      break;
    }
    case "fullscreen": {
      sizeClass = "w-full h-full";
      break;
    }
    default: {
      sizeClass = "w-[400px] max-w-[85%] max-h-[80%]";
    }
  }
  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      onClose();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);
  return (
    <div
      className={`${openClass} z-10 fixed top-0 left-0 h-full w-full flex justify-center items-center bg-[#000000b8] text-white`}
    >
      <div
        className={`${sizeClass} grid grid-rows-[auto_1fr_auto] bg-white dark:bg-gray-600 shadow-lg `}
      >
        <div className="flex gap-2 justify-between items-center p-2.5 shadow-sm bg-[#d5d5e6] dark:bg-gray-500">
          <h3 className="font-semibold text-gray-700 text-md dark:text-gray-100">
            {heading}
          </h3>
          <IconButton onClick={onClose} noBackground>
            <XMarkIcon className="w-5 h-5" />
          </IconButton>
        </div>
        <div className="overflow-auto">{children}</div>
        {hasFooter && (
          <div className="flex gap-4 justify-start items-center p-2.5 bg-[#d5d5e6] dark:bg-gray-500">
            {hasSubmit && (
              <Button
                onClick={onSubmit}
                className="mt-2 dark:hover:bg-gray-400"
                btnType="primary"
              >
                Submit
              </Button>
            )}
            {hasReset && (
              <Button
                onClick={onReset}
                className="mt-2 dark:hover:bg-gray-400"
                btnType="secondary"
              >
                Download
              </Button>
            )}
            {hasDelete && (
              <Button
                onClick={onDelete}
                className="mt-2 dark:hover:bg-red-400"
                btnType="error"
              >
                Delete
              </Button>
            )}
            <Button
              onClick={onClose}
              className="mt-2 dark:hover:bg-gray-400"
              btnType="reset"
            >
              Close
            </Button>

            {showError && hasError && (
              <p className="ml-auto text-xs font-semibold text-red-500">
                {errorMsg && errorMsg.length > 0
                  ? errorMsg
                  : "One or More Errors, Check field for Details."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ModalPopup.defaultProps = defaultProps;
export default ModalPopup;
