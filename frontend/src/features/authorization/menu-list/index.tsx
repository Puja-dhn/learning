import MASTER_MENU_LIST from "./master";

import AECT_MENU_LIST from "./aect";

import { getFlatMenuList } from "../utils";

const APP_MENUS = [
  {
    appId: 1,
    routeMaster: "master",
    menuList: MASTER_MENU_LIST,
    menuFlatList: [...getFlatMenuList(MASTER_MENU_LIST)],
  },
  {
    appId: 2,
    routeMaster: "aect",
    menuList: AECT_MENU_LIST,
    menuFlatList: [...getFlatMenuList(AECT_MENU_LIST)],
  },
];

export { MASTER_MENU_LIST, APP_MENUS, AECT_MENU_LIST };
