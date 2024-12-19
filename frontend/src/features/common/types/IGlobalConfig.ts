import { IOptionList } from "@/features/ui/types";
import ILastSelection from "./ILastSelection";
import ILocationItem from "./ILocationItem";
import IOrgItem from "./IOrgItem";

interface IGlobalConfig {
  loginType: string;
  appMode: string;
  locationId: number;
  divisionId: number;
  areaId: number;
  teamId: number;
  currArea: IOrgItem;
  currDivision: IOrgItem;
  currLocation: ILocationItem;
  lastSelection: ILastSelection;
  roleTypes: IOptionList[];
}

export default IGlobalConfig;
