import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";

import { Button } from "../buttons";
import { IOptionList } from "../types";

interface IProps {
  selectedValueList: IOptionList[];
  optionList: IOptionList[];
  onChange: (e: IOptionList[]) => void;
  defaultSelectValueText?: string;
  className?: string;
  mode?: "Normal" | "Compact";
  topOffset?: number;
}

const defaultProps = {
  defaultSelectValueText: "Select one or more Values",
  className: "",
  mode: "Normal",
  topOffset: 0,
};
function SelectMultiple(props: IProps) {
  const {
    selectedValueList,
    optionList,
    defaultSelectValueText,
    onChange,
    className,
    mode,
    topOffset,
  } = props;

  const [status, setStatus] = useState(false);
  const [currSelectedValueList, setCurrSelectedValueList] = useState<
    IOptionList[]
  >([...selectedValueList]);
  const hiddenClass = status ? "" : "hidden";
  const btnRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [listPosition, setListPosition] = useState<{
    position: string;
    top: number;
    left: number;
    width: number;
  }>({ position: "bottom", top: 0, left: 0, width: 100 });

  const positionClass =
    listPosition.position === "bottom" ? " justify-start" : "justify-end";

  const positionGridClass =
    listPosition.position === "bottom"
      ? " grid-rows-[auto_1fr]"
      : "grid-rows-[1fr_auto]";

  const positonOrderList =
    listPosition.position === "bottom" ? " order-2" : "order-1";
  const positonMarginClass =
    listPosition.position === "bottom" ? " mt-2" : "mb-2";

  const updateListPosition = () => {
    if (btnRef && btnRef.current) {
      const viewPortHeight = window.innerHeight;
      const minListHeight = 300;
      const targetButtonPosition = btnRef.current.getBoundingClientRect();

      let position = "bottom";
      let currTop = 0;
      let currLeft = 0;
      let currWidth = 0;
      const currtopOffset = topOffset || 0;

      if (
        targetButtonPosition.y +
          targetButtonPosition.height +
          minListHeight +
          5 >
        viewPortHeight
      ) {
        position = "top";
      }

      currLeft = targetButtonPosition.x;
      currWidth = targetButtonPosition.width;
      if (position === "bottom") {
        currTop =
          targetButtonPosition.y + targetButtonPosition.height - currtopOffset;
      } else {
        currTop = targetButtonPosition.y - 300 - currtopOffset;
      }

      setListPosition({
        position,
        top: 250,
        left: 15,
        width: currWidth,
      });
    }
  };

  const handleClickOutSide = (event: any) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      btnRef.current &&
      !btnRef.current.contains(event.target)
    ) {
      setStatus(false);
    }
  };

  useEffect(() => {
    setCurrSelectedValueList([...selectedValueList]);
  }, [selectedValueList]);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [divRef]);

  useEffect(() => {
    // Bind the event listener
    window.addEventListener("resize", updateListPosition);
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("resize", updateListPosition);
    };
  }, [btnRef]);

  const renderButtonData = () => {
    if (mode === "Compact") {
      if (currSelectedValueList.length <= 0) {
        return defaultSelectValueText;
      }
      return currSelectedValueList.length === 1
        ? currSelectedValueList.map((item) => (
            <div
              key={item.id}
              className="p-1 px-2.5 border-[1px]  border-gray-300 dark:border-gray-600 bg-cyan-700 text-yellow-100 dark:text-gray-300 rounded-lg "
            >
              {item.name}
            </div>
          ))
        : `${currSelectedValueList.length} Selected`;
    }
    return currSelectedValueList && currSelectedValueList.length > 0 ? (
      <div className="flex flex-wrap items-center justify-start w-full gap-2 ">
        {currSelectedValueList &&
          currSelectedValueList.map((item) => (
            <div
              key={item.id}
              className="p-1 px-2.5 border-[1px]  border-gray-300 dark:border-gray-600 bg-cyan-700 text-yellow-100 dark:text-gray-300 rounded-lg "
            >
              {item.name}
            </div>
          ))}
      </div>
    ) : (
      <div>{defaultSelectValueText}</div>
    );
  };

  const handleSelectionChangeAll = () => {
    if (currSelectedValueList.length > 0) {
      setCurrSelectedValueList([]);
      onChange([]);
    } else {
      setCurrSelectedValueList([...optionList]);
      onChange([...optionList]);
    }
  };

  const handleSelectionChange = (e: IOptionList) => {
    const oldSelectedList = [...currSelectedValueList];
    const findIFAlreadySelected = oldSelectedList.filter(
      (item) => item.id === e.id,
    );
    if (findIFAlreadySelected.length > 0) {
      const currFoundIndex = oldSelectedList.findIndex(
        (item) => item.id === e.id,
      );
      if (currFoundIndex >= 0) {
        oldSelectedList.splice(currFoundIndex, 1);
      }
    } else {
      oldSelectedList.push(e);
    }

    setCurrSelectedValueList([...oldSelectedList]);
    onChange([...oldSelectedList]);
  };

  const isItemSelected = (compareVal: string) => {
    let retVal = false;
    if (currSelectedValueList && currSelectedValueList.length > 0) {
      const filteredData =
        currSelectedValueList &&
        currSelectedValueList.filter((item) => item.id === compareVal);
      if (filteredData && filteredData.length > 0) {
        retVal = true;
      }
    }
    return retVal;
  };

  return (
    <div className={twMerge(`w-full flex flex-col gap-2 ${className} `)}>
      <Button
        onClick={() => {
          updateListPosition();
          setStatus((oldState) => !oldState);
        }}
        elementRef={btnRef}
        className="bg-white hover:bg-white border-[1px] border-gray-300 dark:border-gray-600 dark:bg-gray-700 hover:dark:bg-gray-700 gap-0 p-2.5 px-3 font-normal"
      >
        <div className="grid grid-cols-[1fr_auto] justify-items-start items-center w-full  gap-2">
          {renderButtonData()}
          <div>
            {status ? (
              <ChevronUpIcon className="w-4 h-4" pointerEvents="none" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" pointerEvents="none" />
            )}
          </div>
        </div>
      </Button>
      <div
        className={`w-[100%] h-[300px] absolute flex flex-col ${positionClass} top-[38px] z-10 left-0 bg-transparent text-gray-900   ${hiddenClass} `}
        style={{
          top: listPosition.top,
          left: listPosition.left,
          width: listPosition.width,
        }}
      >
        <div
          ref={divRef}
          className={`max-h-full grid ${positionGridClass}  p-2 border-[1px] border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-500`}
        >
          <div className="p-[2px] bg-[#f0f8ff]">
            <Button
              className="w-full gap-0 px-2 font-normal dark:bg-gray-500 dark:hover:bg-gray-700"
              onClick={() => {
                handleSelectionChangeAll();
              }}
            >
              {currSelectedValueList && currSelectedValueList.length > 0
                ? "Un-Select All"
                : "Select All"}
            </Button>
          </div>
          <div
            className={`overflow-y-auto overflow-x-hidden ${positonOrderList}`}
          >
            <ul className={positonMarginClass}>
              {optionList.map((item) => (
                <li className="p-[2px]" key={item.id}>
                  <Button
                    className="w-full gap-0 px-2 font-normal dark:bg-gray-500 dark:hover:bg-gray-700"
                    onClick={() => {
                      handleSelectionChange(item);
                    }}
                  >
                    <div className="w-full grid grid-cols-[auto_1fr] gap-2 items-center justify-items-start">
                      <CheckCircleIcon
                        className={
                          isItemSelected(item.id.toString())
                            ? "w-4 h-4 text-green-600 dark:text-green-400"
                            : "w-4 h-4 text-gray-400 dark:text-gray-600"
                        }
                        pointerEvents="none"
                      />
                      {item.name}
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

SelectMultiple.defaultProps = defaultProps;
export default SelectMultiple;
