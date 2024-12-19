interface ILogAectData {
  ID: number;
  TEAM_ID: number;
  TEAM_NAME: string;
  AREA_ID: number;
  AREA_NAME: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  OBS_DESC: string;
  CATEGORY: string;
  LOCATION: string;
  SEVERITY: string;
  REPORTED_BY: number;
  REPORTED_BY_DISP_NAME: string;
  REPORTED_DATE: string;
  STATUS: string;
  ACTION_PLANNED: string;
  PDC_DATE: string;
  ACTION_TAKEN: string;
  ACTION_CLOSED_BY: number;
  ACTION_CLOSED_BY_DISP_NAME: string;
  ACTION_CLOSED_DATE: string;
  AREA_INCHARGE_ID: number;
}

export default ILogAectData;
