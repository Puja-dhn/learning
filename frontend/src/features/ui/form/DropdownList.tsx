import React from "react";
import { twMerge } from "tailwind-merge";
import { Controller } from "react-hook-form";
import Select from "../elements/Select";
import { IOptionList } from "../types";

interface IProps {
  name: string;
  label: string;
  control: any;
  optionList: IOptionList[];
  disabled?: boolean;
  changeHandler?: (data: string | number) => void;
  showLabel?: boolean;
  className?: string;
  mandatory?: boolean;
}

const defaultProps = {
  disabled: false,
  changeHandler: () => {},
  showLabel: true,
  className: "",
  mandatory: false,
};

function DropdownList(props: IProps) {
  const {
    name,
    label,
    control,
    optionList,
    disabled,
    changeHandler,
    showLabel,
    className,
    mandatory,
  } = props;
  return showLabel ? (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <label
            htmlFor={name}
            className="block text-sm font-normal text-gray-900 dark:text-gray-300"
          >
            {label}
            {mandatory && <span className="text-red-700">*</span>}
            <Select
              id={name}
              value={value}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                let currValue = e.target.value;
                if (currValue && currValue.length > 0) {
                  currValue = currValue.replace('"', "'");
                }
                onChange(currValue);

                if (changeHandler) {
                  changeHandler(e.target.value);
                }
              }}
              className={twMerge(
                `bg-gray-50 border border-gray-300 mt-2 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400 ${className}`,
              )}
            >
              {optionList.map((item) => (
                <option key={item.id} value={item.id} className="text-left">
                  {item.name}
                </option>
              ))}
            </Select>
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
  ) : (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <Select
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let currValue = e.target.value;
              if (currValue && currValue.length > 0) {
                currValue = currValue.replace('"', "'");
              }
              onChange(currValue);

              if (changeHandler) {
                changeHandler(e.target.value);
              }
            }}
            className="bg-gray-50 border border-gray-300 mt-2 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400"
          >
            {optionList.map((item) => (
              <option key={item.id} value={item.id} className="text-left">
                {item.name}
              </option>
            ))}
          </Select>

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

DropdownList.defaultProps = defaultProps;
export default DropdownList;
