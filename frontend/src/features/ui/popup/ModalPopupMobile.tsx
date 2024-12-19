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
  onRevert?: () => void;
  hasRevert?: boolean;
  onReview?: () => void;
  hasReview?: boolean;
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
  onRevert: () => null,
  hasRevert: false,
  onReview: () => null,
  hasReview: false,
  hasFooter: true,
  errorMsg: "",
};

function ModalPopupMobile(props: IProps) {
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
    onRevert,
    hasRevert,
    onReview,
    hasReview,
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
      className={`${openClass} z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[#000000b8] text-white`}
    >
      <div className="w-full h-full grid grid-rows-[auto_1fr_auto] bg-[#f3f6f9] dark:bg-gray-600 shadow-lg ">
        <div className="flex gap-2 justify-between items-center p-1.5 shadow-sm bg-[#014098] dark:bg-gray-500">
          <h3 className="font-semibold text-white text-md dark:text-gray-100">
            {heading}
          </h3>
          <IconButton onClick={onClose} noBackground className="text-white ">
            <XMarkIcon className="w-5 h-5" />
          </IconButton>
        </div>
        <div className="overflow-auto">{children}</div>
        {hasFooter && (
          <div className="flex gap-2 justify-start items-center p-1.5 ">
            {hasSubmit && (
              <Button
                onClick={onSubmit}
                className="mt-2 dark:hover:bg-gray-400 text-white bg-[#014098] border-gray-800 bg-opacity-100"
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
                Reset
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
            {hasReview && (
              <Button
                onClick={onReview}
                className="mt-2 dark:hover:bg-gray-400 text-white bg-[#014098] border-gray-800 bg-opacity-100"
                btnType="error"
              >
                Review & Close
              </Button>
            )}
            {hasRevert && (
              <Button
                onClick={onRevert}
                className="mt-2 dark:hover:bg-gray-400 text-white bg-[#636363] border-gray-800 bg-opacity-100"
                btnType="error"
              >
                Revert
              </Button>
            )}
            <Button
              onClick={onClose}
              className="mt-2 text-gray-900 bg-gray-200 border-gray-800 dark:hover:bg-gray-400"
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

ModalPopupMobile.defaultProps = defaultProps;
export default ModalPopupMobile;
