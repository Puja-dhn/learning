import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  selectedValueList: string[];
  changeHandler: (e: string[]) => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  defaultSelectValueText?: string;
  placeholder?: string;
}

const defaultProps = {
  className: "",
  disabled: false,
  size: "md",
  defaultSelectValueText: "Add one or more List",
  placeholder: "",
};

function InputList(props: IProps) {
  const {
    selectedValueList,
    disabled,
    changeHandler,
    className,
    size,
    defaultSelectValueText,
    placeholder,
  } = props;

  const [currSelectedValueList, setCurrSelectedValueList] = useState<string[]>([
    ...selectedValueList,
  ]);

  const refInputText = useRef<HTMLInputElement>(null);

  let sizeClass = "p-2 px-2.5 text-sm ";
  switch (size) {
    case "sm":
      sizeClass = "p-1 px-1.5 text-xs ";
      break;
    case "lg":
      sizeClass = "p-2 px-4 text-md ";
      break;
    default:
      sizeClass = "p-2 px-2.5 text-sm ";
  }

  const handleItemDelete = (deletedItem: string) => {
    const findItemIndex = currSelectedValueList.findIndex(
      (item) => item === deletedItem,
    );

    if (findItemIndex >= 0) {
      const oldSelectedList = [...currSelectedValueList];
      oldSelectedList.splice(findItemIndex, 1);
      setCurrSelectedValueList([...oldSelectedList]);
      changeHandler([...oldSelectedList]);
    }
  };

  const renderButtonData = () => {
    return currSelectedValueList && currSelectedValueList.length > 0 ? (
      <div className="flex flex-wrap items-center justify-start w-full gap-2 ">
        {currSelectedValueList &&
          currSelectedValueList.map((item) => (
            <div
              key={item}
              className="grid grid-cols-[auto_1fr] justify-items-start items-center gap-1 p-1 px-2.5 border-[1px]  border-gray-300 dark:border-gray-600 bg-cyan-700 text-yellow-100 dark:text-gray-300 rounded-lg "
            >
              <button
                type="button"
                onClick={() => {
                  handleItemDelete(item);
                }}
                className="text-gray-600 dark:text-gray-400"
              >
                <XMarkIcon className="w-3.5 h-3.5 text-cyan-200 dark:text-cyan-100 hover:text-white dark:hover:text-cyan-400" />
              </button>
              {item}
            </div>
          ))}
      </div>
    ) : (
      <div className="text-xs text-gray-400 dark:text-gray-400">
        {defaultSelectValueText}
      </div>
    );
  };

  const handleTextChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      refInputText.current &&
      (event.key === "Enter" || event.key === "Tab") &&
      refInputText.current.value.length > 0
    ) {
      const currInputValue = refInputText.current.value;
      const oldSelectedList = [...currSelectedValueList];
      const findIFAlreadySelected = oldSelectedList.filter(
        (item) => item === currInputValue,
      );
      if (findIFAlreadySelected.length <= 0) {
        oldSelectedList.push(currInputValue);
      }

      setCurrSelectedValueList([...oldSelectedList]);
      changeHandler([...oldSelectedList]);
      refInputText.current.value = "";
      setTimeout(() => {
        if (refInputText && refInputText.current) {
          refInputText.current.focus();
        }
      }, 300);
    }
  };

  return (
    <div className={twMerge(`w-full flex flex-col gap-2 ${className} `)}>
      <input
        type="text"
        disabled={disabled}
        ref={refInputText}
        onKeyDown={handleTextChange}
        placeholder={placeholder}
        className={twMerge(
          `bg-gray-50 border border-gray-300 outline-none focus:border-blue-900 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-gray-400 ${sizeClass}  ${className}`,
        )}
      />
      <div className="grid grid-cols-[1fr_auto] justify-items-start items-center w-full  gap-2">
        {renderButtonData()}
      </div>
    </div>
  );
}

InputList.defaultProps = defaultProps;
export default InputList;
