import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { MinusSmallIcon } from "@heroicons/react/24/outline";

import { useAppSelector } from "@/store/hooks";
import { IMenuItem } from "./types";
import { useAccessConfig, useMenuConfig } from "./hooks";
import { useLayoutConfig } from "../layout/hooks";
import { APP_MENUS } from "./menu-list";

interface IProps {
  menuItem: IMenuItem;
  isChild: boolean;
  disableTabFocus?: boolean;
}

const defaultProps = {
  disableTabFocus: false,
};

function MenuItem(props: IProps) {
  const { menuItem, isChild, disableTabFocus } = props;
  const { id, icon, iconSelected, name, children, path, menuType } = menuItem;

  const menuState = useAppSelector(({ menu }) => menu, shallowEqual);
  const navigate = useNavigate();
  const { setApp } = useAccessConfig();
  const { setSelMenu } = useMenuConfig();
  const { resetLayout } = useLayoutConfig();
  const [active, setActive] = useState(true);
  const [open, setOpen] = useState(false);
  const activeBgClass = active ? "bg-[#f5f5f5] h-[60px] " : "h-[60px]";
  const activeTextClass = active
    ? "text-gray-900 font-bold "
    : "text-gray-900 font-normal group-hover:bg-[#f5f5f5] group-hover:font-bold ";
  const activeBorderClass = active ? "" : "";
  const visibleClass = open ? "" : "hidden";
  useEffect(() => {
    setActive(id === menuState.id);
    resetLayout();
  }, [menuState]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleActive = () => {
    if (name !== "" && children.length <= 0) {
      setSelMenu(menuItem);

      if (menuType === "Static") {
        const currAppData = APP_MENUS.filter(
          (item) => item.appId === menuItem.appId,
        )[0];
        setApp(0);
        navigate(`/${currAppData.routeMaster}/${path}`, { replace: true });
      } else {
        navigate(path, { replace: true });
      }
    }
  };
  return (
    <div className="w-full border-b-[1px]">
      {children && children.length > 0 ? (
        <div className="flex flex-col ">
          <div
            className={`h-[45px] flex group items-center ${activeBgClass}  ${activeBorderClass} `}
          >
            <button
              tabIndex={disableTabFocus ? -1 : 0}
              type="button"
              className={`h-full pl-4 py-2.5 ${activeTextClass}`}
              onClick={handleOpen}
            >
              {active ? iconSelected : icon}
            </button>
            <button
              tabIndex={disableTabFocus ? -1 : 0}
              type="button"
              className={`h-full w-full text-left text-sm px-4 py-2.5  ${activeTextClass}`}
              onClick={handleOpen}
            >
              {name}
            </button>
            <button
              tabIndex={disableTabFocus ? -1 : 0}
              type="button"
              className={`h-full px-4 py-2.5 ${activeTextClass}`}
              onClick={handleOpen}
            >
              {open ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          <ul className={`${visibleClass}`}>
            {children.map((subMenu) => (
              <li key={subMenu.id} className="flex ">
                <MenuItem menuItem={subMenu} isChild />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          className={`h-[45px] flex group items-center ${activeBgClass}  ${activeBorderClass} `}
        >
          {isChild && (
            <div className="pl-4 py-2.5 text-gray-400">
              <MinusSmallIcon className="w-4 h-4" />
            </div>
          )}
          <button
            tabIndex={disableTabFocus ? -1 : 0}
            type="button"
            className={`h-full pl-4 py-2.5 ${activeTextClass}`}
            onClick={handleActive}
          >
            {active ? iconSelected : icon}
          </button>
          <button
            tabIndex={disableTabFocus ? -1 : 0}
            type="button"
            className={`h-full w-full text-left text-sm px-4 py-2.5  ${activeTextClass}`}
            onClick={handleActive}
          >
            {name}
          </button>
        </div>
      )}
    </div>
  );
}

MenuItem.defaultProps = defaultProps;
export default MenuItem;
