import { IOptionList } from "@/features/ui/types";
import IAreasList from "./IAreasList";

interface ISIOMasterData {
  DEPARTMENT: IOptionList[];
  CATEGORY: IOptionList[];
  SEVERITY: IOptionList[];
  AREA: IAreasList[];
  USERS: IOptionList[];
}
export default ISIOMasterData;
