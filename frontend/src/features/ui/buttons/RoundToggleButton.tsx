import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    btnFlag?: string;
    disabled?: boolean;
    elementRef?: React.RefObject<HTMLButtonElement>;
}

const defaultProps = {
    onClick: () => null,
    className: "",
    btnFlag: "Yes",
    disabled: false,
    elementRef: null,
};

function RoundToggleButton(props: Props) {
    const { children, onClick, className, btnFlag, disabled, elementRef } = props;
    let backgroundClass =
        "text-white-900 bg-green-900 hover:bg-green-900 dark:bg-green-600 dark:text-white-900 dark:hover:bg-green-500 ";
    switch (btnFlag) {
        case "Yes":
            backgroundClass =
                "text-white-900 bg-green-900 hover:bg-green-900 dark:bg-green-600 dark:text-white-900 dark:hover:bg-green-500 focus:ring-green-900 dark:focus:ring-green-900 ";
            break;
        case "No":
            backgroundClass =
                "text-white-900 bg-red-900 hover:bg-red-900 dark:bg-red-600 dark:text-white-900 dark:hover:bg-red-500 focus:ring-red-900 dark:focus:ring-green-900 ";
            break;
        default:
            backgroundClass =
                "text-white-900 bg-red-900 hover:bg-red-900 dark:bg-red-600 dark:text-white-900 dark:hover:bg-red-500 focus:ring-green-900 dark:focus:ring-green-900 ";
    }
    return (
        <button
            type="button"
            className={twMerge(`inline-flex items-center gap-2 text-sm font-medium rounded-full  px-3 py-3 text-center
        focus:ring-2 focus:outline-none 
       ${backgroundClass}
       ${className}`)}
            onClick={onClick}
            disabled={disabled}
            ref={elementRef}
        >
            {children}
        </button>
    );
}

RoundToggleButton.defaultProps = defaultProps;
export default RoundToggleButton;
