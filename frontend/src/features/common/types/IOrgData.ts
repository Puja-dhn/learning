import { IOptionList } from "@/features/ui/types";
import ILocationItem from "./ILocationItem";
import IOrgItem from "./IOrgItem";
import ISDTTeam from "./ISDTTeam";

interface IOrgData {
  locations: ILocationItem[];
  divisions: IOrgItem[];
  areas: IOrgItem[];
  roleTypes: IOptionList[];
  sdtTeams: ISDTTeam[];
}

export default IOrgData;
