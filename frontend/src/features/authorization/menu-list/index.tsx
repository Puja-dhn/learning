import MASTER_MENU_LIST from "./master";

import { getFlatMenuList } from "../utils";
import SIS_MENU_LIST from "./sis";
import PTW_MENU_LIST from "./ptw";

const APP_MENUS = [
  {
    appId: 1,
    routeMaster: "master",
    menuList: MASTER_MENU_LIST,
    menuFlatList: [...getFlatMenuList(MASTER_MENU_LIST)],
  },
  {
    appId: 2,
    routeMaster: "sio",
    menuList: SIS_MENU_LIST,
    menuFlatList: [...getFlatMenuList(SIS_MENU_LIST)],
  },
  {
    appId: 3,
    routeMaster: "ptw",
    menuList: PTW_MENU_LIST,
    menuFlatList: [...getFlatMenuList(PTW_MENU_LIST)],
  },
];

export { MASTER_MENU_LIST, APP_MENUS, SIS_MENU_LIST, PTW_MENU_LIST };
