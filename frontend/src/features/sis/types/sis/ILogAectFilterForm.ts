interface ILogAectFilterForm {
  ID: number | null;
  TEAM_ID: number;
  AREA_ID: number;
  DIVISION_ID: number;
  LOCATION_ID: number;
  OBS_DESC: string;
  CATEGORY: string;
  LOCATION: string;
  SEVERITY: string;
  REPORTED_BY: number;
  REPORTED_DATE_FROM: string;
  REPORTED_DATE_TO: string;
  STATUS: string;
  PDC_DATE_FROM: string;
  PDC_DATE_TO: string;
  ACTION_CLOSED_DATE_FROM: string;
  ACTION_CLOSED_DATE_TO: string;
}

export default ILogAectFilterForm;
