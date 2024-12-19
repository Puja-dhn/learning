interface ILossStationDataDetails {
  ID: number;
  TEAM_ID: number;
  TEAM_NAME: string;
  AREA_ID: number;
  AREA_NAME: string;
  DIVISION_ID: number;
  DIVISION_NAME: string;
  NMC_DESC: string;
  LOCATION: string;
  SEVERITY: string;
  REPORTED_BY: number;
  REPORTED_BY_DISP_NAME: string;
  REPORTED_DATE: string;
  LOG_SHIFT: string;
  STATUS: string;
  LOG_NO_SAFETYPORTAL: string;
}

export default ILossStationDataDetails;
