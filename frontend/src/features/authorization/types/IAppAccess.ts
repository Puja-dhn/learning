import IDBAppItem from "./IDBAppItem";
import IDBMenuItem from "./IDBMenuItem";

interface IAppAccess {
  menus: IDBMenuItem[];
  apps: IDBAppItem[];
  adminAreas: number[];
  appId: number;
}

export default IAppAccess;
