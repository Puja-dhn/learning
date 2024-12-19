import React from "react";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface IProps {
  name: string;
  label: string;
  control: any;
  type?: string;
  disabled?: boolean;
  changeHandler?: (data: string | number) => void;
  showLabel?: boolean;
  className?: string;
  labelType?: "Vertical" | "Horizontal";
  disableDoubleQuotes?: boolean;
}

const defaultProps = {
  type: "text",
  disabled: false,
  changeHandler: () => {},
  showLabel: true,
  className: "",
  labelType: "Vertical",
  disableDoubleQuotes: false,
};

function TextFieldAuto(props: IProps) {
  const {
    name,
    label,
    control,
    type,
    disabled,
    changeHandler,
    showLabel,
    className,
    labelType,
    disableDoubleQuotes,
  } = props;
  const disabledClass = disabled
    ? "bg-gray-200 dark:bg-gray-500 dark:text-gray-300"
    : "";

  if (!showLabel) {
    return (
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <input
              id={name}
              type={type}
              value={value}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let currValue = e.target.value;
                if (currValue && currValue.length > 0 && disableDoubleQuotes) {
                  currValue = currValue.replace('"', "'");
                }

                if (type === "text" && /(<([^>]+)>)/gi.test(currValue)) {
                  currValue = currValue.replace(/(<([^>]+)>)/gi, "");
                }
                if (type === "text" && /['{}<>|=]/.test(currValue)) {
                  currValue = currValue.replace(/['{}<>|=]/, "");
                }
                onChange(currValue);

                if (changeHandler) {
                  changeHandler(currValue);
                }
              }}
              autoComplete="new-password"
              className={twMerge(
                `bg-gray-50 border border-gray-300 mt-2 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400 ${className}`,
              )}
            />

            {error && error.message && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-300">
                {error.message}
              </p>
            )}
          </>
        )}
        name={name}
        control={control}
      />
    );
  }

  if (showLabel && labelType === "Horizontal") {
    return (
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <label
              htmlFor={name}
              className="grid items-center justify-center w-full grid-cols-2 gap-2.5 text-sm font-normal text-right text-gray-900 dark:text-gray-300"
            >
              {label}
              <input
                id={name}
                type={type}
                value={value}
                disabled={disabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let currValue = e.target.value;
                  if (currValue && currValue.length > 0) {
                    currValue = currValue.replace('"', "'");
                  }

                  if (type === "text" && /(<([^>]+)>)/gi.test(currValue)) {
                    currValue = currValue.replace(/(<([^>]+)>)/gi, "");
                  }
                  if (type === "text" && /['{}<>|=]/.test(currValue)) {
                    currValue = currValue.replace(/['{}<>|=]/, "");
                  }
                  onChange(currValue);

                  if (changeHandler) {
                    changeHandler(currValue);
                  }
                }}
                autoComplete="new-password"
                className={twMerge(
                  `bg-gray-50 border border-gray-300 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400 ${disabledClass} ${className}`,
                )}
              />
            </label>
            {error && error.message && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-300">
                {error.message}
              </p>
            )}
          </>
        )}
        name={name}
        control={control}
      />
    );
  }

  return (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <label
            htmlFor={name}
            className="block text-sm font-normal text-gray-900 dark:text-gray-300"
          >
            {label}
            <input
              id={name}
              type={type}
              value={value}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let currValue = e.target.value;
                if (currValue && currValue.length > 0) {
                  currValue = currValue.replace('"', "'");
                }

                if (type === "text" && /(<([^>]+)>)/gi.test(currValue)) {
                  currValue = currValue.replace(/(<([^>]+)>)/gi, "");
                }
                if (type === "text" && /['{}<>|=]/.test(currValue)) {
                  currValue = currValue.replace(/['{}<>|=]/, "");
                }
                onChange(currValue);

                if (changeHandler) {
                  changeHandler(currValue);
                }
              }}
              autoComplete="new-password"
              className={twMerge(
                `bg-gray-50 border border-gray-300 mt-2 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400 ${disabledClass} ${className} `,
              )}
            />
          </label>
          {error && error.message && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-300">
              {error.message}
            </p>
          )}
        </>
      )}
      name={name}
      control={control}
    />
  );
}

TextFieldAuto.defaultProps = defaultProps;
export default TextFieldAuto;
