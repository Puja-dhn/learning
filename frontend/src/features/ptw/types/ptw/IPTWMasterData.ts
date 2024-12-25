import { IOptionList } from "@/features/ui/types";
import IConfigsList from "./IConfigsList";
import IContractorList from "./IContractorList";
import IDepartmentList from "./IDepartmentList";
import IAreasList from "@/features/sis/types/sis/IAreasList";

interface IPTWMasterData {
  DEPARTMENT: IDepartmentList[];
  CONFIG: IConfigsList[];
  AREA: IAreasList[];
  USERS: IOptionList[];
  CONTRACTORS: IContractorList[];
}
export default IPTWMasterData;
