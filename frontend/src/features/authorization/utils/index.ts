import { IDBMenuItem, IMenuItem } from "../types";

function getFlatMenuList(menuList: IMenuItem[]): IMenuItem[] {
  const retMenuList: IMenuItem[] = [];
  menuList.forEach((currMenuItem) => {
    if (currMenuItem.children.length > 0) {
      const childMenuList = getFlatMenuList(currMenuItem.children);
      childMenuList.forEach((currChildMenuItem) => {
        retMenuList.push(currChildMenuItem);
      });
    } else {
      retMenuList.push(currMenuItem);
    }
  });

  return retMenuList;
}

const getAllRouteList = (menuData: IDBMenuItem[], routeList: IMenuItem[]) => {
  const allRoutes: IMenuItem[] = [...routeList];
  const allAccessRoutes: IMenuItem[] = [];

  allRoutes.forEach((route) => {
    const filteredMenu = menuData.filter((data) => data.ID === route.id);
    if (filteredMenu.length > 0) {
      if (route.children.length > 0) {
        const currRoute = { ...route };
        currRoute.children = [];
        route.children.forEach((subRoute) => {
          const filteredSubMenu = menuData.filter(
            (data) => data.ID === subRoute.id,
          );
          if (filteredSubMenu.length > 0) {
            currRoute.children.push({
              ...subRoute,
            });
          }
        });
        allAccessRoutes.push(currRoute);
      } else {
        allAccessRoutes.push({
          ...route,
        });
      }
    }
  });

  return allAccessRoutes;
};

export { getFlatMenuList, getAllRouteList };
