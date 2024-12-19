import IAreaList from "./IAreaList";
import IContactsList from "./IContactsList";
import IContractorList from "./IContractorList";
import IDivisionList from "./IDivisionList";
import IObserverList from "./IObserverList";
import ISeverity from "./ISeverity";

interface ISOMasterData {
  LOG_NO: string;
  TEAM_ID: number;
  OBSERVER_LIST: IObserverList[];
  ACT_TYPE: string;
  CATEGORY: string;
  PLANT_NAME: string;
  THEME_NAME: string;
  DIVISION: IDivisionList[];
  AREA: IAreaList[];
  CONTRACTOR: IContractorList[];
  DATE: string;
  TIME_FROM: string;
  TIME_TO: string;
  CONTACTS: IContactsList[];
  TLH_COMMENTS: string;
  SEVERITY: ISeverity[];
}
export default ISOMasterData;
