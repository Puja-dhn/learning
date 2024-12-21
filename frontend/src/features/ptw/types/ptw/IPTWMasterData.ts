import { IOptionList } from "@/features/ui/types";
import IConfigsList from "./IConfigsList";
import IContractorList from "./IContractorList";

interface IPTWMasterData {
  DEPARTMENT: IOptionList[];
  CONFIG: IConfigsList[];
  AREA: IOptionList[];
  USERS: IOptionList[];
  CONTRACTORS: IContractorList[];
}
export default IPTWMasterData;
