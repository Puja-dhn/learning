interface ILogAddObservationsForm {
  LOG_NO: string;
  SRNO: number;
  CURR_SRNO: number;
  AREA_ID: number;
  WORK_LOCATION: string;
  OBS_THEME: string;
  OBS_DESCRIPTION: string;
  ACT_TYPE: string;
  OCCURENCE: number;
  SEVERITY: string;
  TRC_POTENTIAL: string;
  CATEGORY: number;
  SUB_CATEGORY: string;
  CATEGORY_DETAILS: string;
  STANDARD: number;
  POLICY: number;
  STATUS: string;
  REPEATED: string;
  ACTION_TAKEN: string;
  CONSEQUENCES: string;
  BEHAVIOUR: string;
  SOP_WIS_HIRA: string;
  LOGGED_USER_TICKET_NO: number;
  SUBMIT_ACTION_TYPE: string;
}

export default ILogAddObservationsForm;
