import React, { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  openState: boolean;
  message: string;
  handleConfirmCancel: MouseEventHandler;
  handleConfirmOk: MouseEventHandler;
  okText?: string;
  cancelText?: string;
  okClass?: string;
  cancelClass?: string;
  messageClass?: string;
}
const defaultProps = {
  okText: "Confirm",
  cancelText: "Cancel",
  okClass: "",
  cancelClass: "",
  messageClass: "",
};

function ConfirmBox(props: IProps) {
  const {
    openState,
    message,
    handleConfirmCancel,
    handleConfirmOk,
    okText,
    cancelText,
    okClass,
    cancelClass,
    messageClass,
  } = props;
  const openClass = openState ? "flex" : "hidden";
  return (
    <div
      className={`${openClass} z-20 fixed top-0 left-0 h-full w-full flex justify-center items-center bg-[#000000b8] text-white`}
    >
      <div className="w-[400px] max-w-[85%] max-h-[80%] grid grid-rows-[1fr_auto] bg-white dark:bg-gray-600 shadow-lg ">
        <p
          className={twMerge(
            `text-blue-900 overflow-auto text-md font-semibold text-center  p-2.5 py-10 dark:text-gray-100 ${messageClass}`,
          )}
        >
          {message}
        </p>
        <div className="flex gap-4 justify-evenly items-center p-2.5 bg-sky-50 dark:bg-gray-500">
          <button
            type="button"
            onClick={handleConfirmOk}
            className={twMerge(`bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
            px-5 py-2 mt-2 text-sm font-medium text-center text-white rounded-lg min-w-[100px] ${okClass}`)}
          >
            {okText}
          </button>

          <button
            type="button"
            onClick={handleConfirmCancel}
            className={twMerge(`bg-gray-400 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-300 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-400"
            px-5 py-2 mt-2 text-sm font-medium text-center text-white min-w-[100px] ${cancelClass}`)}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
ConfirmBox.defaultProps = defaultProps;
export default ConfirmBox;
