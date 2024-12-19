interface ILogPtwForm {
  ID: number;
  TEAM_ID: number;
  AREA_ID: number;
  MOC_REQUIRED: string;
  MOC_NO: string;
  MOC_TITLE: string;
  OBS_DESC: string;
  CATEGORY: string;
  LOCATION: string;
  SEVERITY: string;
  REPORTED_BY: number;
  STATUS: string;
  ACTION_PLANNED: string;
  PDC_DATE: string;
  ACTION_TAKEN: string;
  ACTION_CLOSED_BY: number;
  ACTION_CLOSED_DATE: string;
}

export default ILogPtwForm;
