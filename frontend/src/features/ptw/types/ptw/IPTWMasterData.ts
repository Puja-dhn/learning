import { IOptionList } from "@/features/ui/types";
import IConfigsList from "./IConfigsList";
import IContractorList from "./IContractorList";
import IDepartmentList from "./IDepartmentList";

interface IPTWMasterData {
  DEPARTMENT: IDepartmentList[];
  CONFIG: IConfigsList[];
  AREA: IOptionList[];
  USERS: IOptionList[];
  CONTRACTORS: IContractorList[];
}
export default IPTWMasterData;
