interface ILogNMCForm {
  ID: number;
  TEAM_ID: number;
  AREA_ID: number;
  NMC_DESC: string;
  LOCATION: string;
  SEVERITY: string;
  REPORTED_BY: number;
  LOG_DATE: string;
  CAUSE: string;
  SHIFTS: string;
}

export default ILogNMCForm;
