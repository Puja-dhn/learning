interface ILogNMCFilterForm {
  ID: number | null;
  TEAM_ID: number;
  AREA_ID: number;
  DIVISION_ID: number;
  LOCATION_ID: number;
  NMC_DESC: string;
  LOCATION: string;
  SEVERITY: string;
  REPORTED_BY: number;
  REPORTED_DATE_FROM: string;
  REPORTED_DATE_TO: string;
  LOG_NO_SAFETYPORTAL: string;
}

export default ILogNMCFilterForm;
