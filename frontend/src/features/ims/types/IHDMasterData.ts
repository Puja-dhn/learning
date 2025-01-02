import IDepartment from "@/features/common/types/IDepartment";
import IAreasList from "@/features/sis/types/sis/IAreasList";
import { IOptionList } from "@/features/ui/types";

interface IHDMasterData {
  DEPARTMENT: IDepartment[];
  INJURYTYPE: IOptionList[];
  FACTORS: IOptionList[];
  AREA: IAreasList[];
  CONTRACTORS: IOptionList[];
  USERS: IOptionList[];
  BODYPART: IOptionList[];
  INJURYNATURE: IOptionList[];
  INJURYMEDICAL: IOptionList[];
}
export default IHDMasterData;
