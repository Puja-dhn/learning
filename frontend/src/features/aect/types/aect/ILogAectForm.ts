interface ILogAectForm {
  ID: number;
  TEAM_ID: number;
  AREA_ID: number;
  OBS_DESC: string;
  CATEGORY: string;
  LOCATION: string;
  SEVERITY: string;
  REPORTED_BY: number;
  REPORTED_DATE: string;
  STATUS: string;
  ACTION_PLANNED: string;
  PDC_DATE: string;
  ACTION_TAKEN: string;
  ACTION_CLOSED_BY: number;
  ACTION_CLOSED_DATE: string;
}

export default ILogAectForm;
