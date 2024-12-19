import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";

import { Button } from "../buttons";
import { IOptionList } from "../types";
import InputText from "./InputText";

interface IProps {
  selectedValue: string;
  optionList: IOptionList[];
  searchText: string;
  searchTextChangeHandler: (data: string) => void;
  onChange: (e: IOptionList) => void;
  defaultSelectValue?: string;
  className?: string;
}

const defaultProps = {
  defaultSelectValue: "",
  className: "",
};
function SelectSearchable(props: IProps) {
  const {
    selectedValue,
    optionList,
    searchText,
    defaultSelectValue,
    searchTextChangeHandler,
    onChange,
    className,
  } = props;
  const [status, setStatus] = useState(false);
  const buttonText = selectedValue || defaultSelectValue || "Searh Value";
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
  const positonOrderSearch =
    listPosition.position === "bottom" ? " order-1" : "order-2";
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
        currTop = targetButtonPosition.y + targetButtonPosition.height;
      } else {
        currTop = targetButtonPosition.y - 300;
      }

      setListPosition({
        position,
        top: currTop,
        left: currLeft,
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

  return (
    <div className={twMerge(`w-full flex flex-col gap-2 ${className} `)}>
      <Button
        onClick={() => {
          updateListPosition();
          setStatus((oldState) => !oldState);
          searchTextChangeHandler("");
        }}
        elementRef={btnRef}
        className="bg-white hover:bg-white border-[1px] border-gray-300 dark:border-gray-600 dark:bg-gray-700 hover:dark:bg-gray-700 gap-0 px-3 font-normal"
      >
        <div className="flex items-center justify-between w-full gap-1">
          {buttonText}{" "}
          {status ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
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
          <div className={`w-full flex items-center ${positonOrderSearch}`}>
            <InputText
              value={searchText}
              placeholder="Search Value"
              changeHandler={(value) =>
                searchTextChangeHandler(value.toString())
              }
            />
          </div>
          <div
            className={`overflow-y-auto overflow-x-hidden ${positonOrderList}`}
          >
            <ul className={positonMarginClass}>
              {optionList && optionList.length > 0 ? (
                optionList.map((item) => (
                  <li className="p-[2px]" key={item.id}>
                    <Button
                      className="w-full gap-0 px-2 font-normal text-left dark:bg-gray-500 dark:hover:bg-gray-700"
                      onClick={() => {
                        onChange(item);
                        setStatus(false);
                      }}
                    >
                      {item.name}
                    </Button>
                  </li>
                ))
              ) : (
                <li className="p-1 text-sm lowercase text-cyan-800 dark:text-gray-300">
                  Please enter 3 or more character to Search
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

SelectSearchable.defaultProps = defaultProps;
export default SelectSearchable;
