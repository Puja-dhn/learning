import IAreasList from "@/features/sis/types/sis/IAreasList";
import { IOptionList } from "@/features/ui/types";

interface IIMSMasterData {
  DEPARTMENT: IOptionList[];
  INJURYTYPE: IOptionList[];
  FACTORS: IOptionList[];
  AREA: IAreasList[];
  CONTRACTORS: IOptionList[];
  USERS: IOptionList[];
  BODYPART: IOptionList[];
  INJURYNATURE: IOptionList[];
  INJURYMEDICAL: IOptionList[];
}
export default IIMSMasterData;
