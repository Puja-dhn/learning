import {
  ILocationItem,
  IOrgItem,
  ISDTTeam,
  ISDTTeamMember,
  IWeekData,
} from "@/features/common/types";
import { IOptionList } from "@/features/ui/types";

/* ENV Varibles */

const BASENAME = process.env.REACT_APP_BASENAME || "";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const ASSET_BASE_URL = process.env.REACT_APP_ASSET_BASE_URL || "";
const ENV_MODE = process.env.REACT_APP_ENV_MODE || "";
const CRYPTO_KEY = process.env.REACT_APP_CRYPTO_KEY || "";
const WIS_BASE_URL = process.env.WIS_BASE_URL || "";
const WIS_DATA_URL = process.env.WIS_DATA_URL || "";
const QC_PDF_URL = process.env.QC_PDF_URL || "";
const QC_REPORT_URL = process.env.QC_REPORT_URL || "";
const SOCKET_BASE_URL = process.env.REACT_APP_SOCKET_BASE_URL || "";
const ISSUE_TRACKING_URL = process.env.ISSUE_TRACKING_URL || "";

/* Genral Constants */

const DEFUALT_VALUE_ALLLOCATION: ILocationItem = {
  ID: 0,
  NAME: "All Locations",
  STATUS: "InActive",
  SHT_NAME: "",
  ORG_ID: "",
  UNIT_ID: "",
  LOCN_ID: "",
};

const DEFAULT_VALUE_ALLDIVISION: IOrgItem = {
  ID: 0,
  NAME: "All Divisions",
  MAS_ID: 0,
  STATUS: "InActive",
  ORG_LEVEL: 0,
  HEAD_TICKET_NO: "",
  HEAD_NAME: "",
  HEAD_ID: 0,
  SOS_ORG_ID: "",
  SOS_UNIT_ID: "",
  SOS_LOCN_ID: "",
  LOCN_ID: 0,
};

const DEFAULT_VALUE_ALLAREA: IOrgItem = {
  ID: 0,
  NAME: "All Areas",
  MAS_ID: 0,
  STATUS: "InActive",
  ORG_LEVEL: 0,
  HEAD_TICKET_NO: "",
  HEAD_NAME: "",
  HEAD_ID: 0,
  SOS_ORG_ID: "",
  SOS_UNIT_ID: "",
  SOS_LOCN_ID: "",
  LOCN_ID: 0,
};

const DEFAULT_VALUE_ALLTEAM: ISDTTeam = {
  ID: 0,
  NAME: "All Teams",
  AREA_ID: 0,
  AREA_NAME: "",
  DIV_ID: 0,
  DIV_NAME: "",
  LOCN_ID: 0,
  STATUS: "InActive",
  MATURITY_LEVEL: "Level 1",
};

const DEFAULT_VALUE_ALLTEAM_MEMBER: ISDTTeamMember = {
  ID: 0,
  TEAM_ID: -1,
  ROLE_TYPE_ID: -1,
  ROLE_TYPE_NAME: "",
  EMP_TYPE: "",
  MEMBER_ID: -1,
  MEMBER_NAME: "",
  MEMBER_TICKET_NO: "",
  AREA_ID: -1,
  LOCN_ID: -1,
  PHOTO_PATH: "",
  TEAM_SLNO: 1,
  SAP_STATUS: "",
};

const DEFAULT_VALUE_LOCATION: ILocationItem = {
  ID: -1,
  NAME: "No Location",
  STATUS: "InActive",
  SHT_NAME: "",
  ORG_ID: "",
  UNIT_ID: "",
  LOCN_ID: "",
};

const DEFAULT_VALUE_DIVISION: IOrgItem = {
  ID: -1,
  NAME: "No Division",
  MAS_ID: 0,
  STATUS: "InActive",
  ORG_LEVEL: 0,
  HEAD_TICKET_NO: "",
  HEAD_NAME: "",
  HEAD_ID: 0,
  SOS_ORG_ID: "",
  SOS_UNIT_ID: "",
  SOS_LOCN_ID: "",
  LOCN_ID: 0,
};

const DEFAULT_VALUE_AREA: IOrgItem = {
  ID: -1,
  NAME: "No Area",
  MAS_ID: 0,
  STATUS: "InActive",
  ORG_LEVEL: 0,
  HEAD_TICKET_NO: "",
  HEAD_NAME: "",
  HEAD_ID: 0,
  SOS_ORG_ID: "",
  SOS_UNIT_ID: "",
  SOS_LOCN_ID: "",
  LOCN_ID: 0,
};

const DEFAULT_VALUE_TEAM: ISDTTeam = {
  ID: -1,
  NAME: "No Team",
  AREA_ID: 0,
  AREA_NAME: "No Area",
  DIV_ID: 0,
  DIV_NAME: "No Division",
  LOCN_ID: 0,
  STATUS: "InActive",
  MATURITY_LEVEL: "Level 1",
};

const DEFAULT_VALUE_TEAM_MEMBER: ISDTTeamMember = {
  ID: -1,
  TEAM_ID: -1,
  ROLE_TYPE_ID: -1,
  ROLE_TYPE_NAME: "",
  EMP_TYPE: "",
  MEMBER_ID: -1,
  MEMBER_NAME: "",
  MEMBER_TICKET_NO: "",
  AREA_ID: -1,
  LOCN_ID: -1,
  PHOTO_PATH: "",
  TEAM_SLNO: 1,
  SAP_STATUS: "",
};

const OBS_CATEGORY_LIST: IOptionList[] = [
  { id: "UA", name: "UA" },
  { id: "UC", name: "UC" },
];

const OBS_SEVERITY_LIST: IOptionList[] = [
  { id: "Minor", name: "Minor" },
  { id: "Serious", name: "Serious" },
  { id: "Fatal", name: "Fatal" },
];

const INS_SEVERITY_LIST: IOptionList[] = [
  { id: "Minor", name: "Minor" },
  { id: "Serious", name: "Serious" },
  { id: "Hipo", name: "Hipo" },
];

const OBS_STATUS_LIST: IOptionList[] = [
  { id: "Open", name: "Open" },
  { id: "Closed", name: "Closed" },
];

const ITEM_STATUS_LIST: IOptionList[] = [
  { id: "Active", name: "Active" },
  { id: "InActive", name: "InActive" },
];

const FY_MONTH_LIST: IOptionList[] = [
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
];

const MONTH_4WEEK_LIST: IWeekData[] = [
  { id: 1, name: "Week 1", week_start: "01", week_end: "07" },
  { id: 2, name: "Week 2", week_start: "08", week_end: "14" },
  { id: 3, name: "Week 3", week_start: "15", week_end: "21" },
  { id: 4, name: "Week 4", week_start: "22", week_end: "28" },
];

const MONTH_5WEEK_LIST: IWeekData[] = [
  ...MONTH_4WEEK_LIST,
  { id: 5, name: "Week 5", week_start: "29", week_end: "31" },
];

const DAILY_SHIFTS: IOptionList[] = [
  { id: "A", name: "A" },
  { id: "B", name: "B" },
  { id: "C", name: "C" },
  { id: "G", name: "G" },
];

const EMP_TYPE: IOptionList[] = [
  { id: "TMST", name: "TMST" },
  { id: "IPT", name: "IPT" },
  { id: "Neem Trainee", name: "Neem Trainee" },
  { id: "Trainee", name: "Trainee" },
  { id: "Temporary", name: "Temporary" },
  { id: "Permanent", name: "Permanent" },
  { id: "Probationer", name: "Probationer" },
];

const DAILY_SHIFTS_INCIDENT: IOptionList[] = [
  { id: "SH1", name: "A" },
  { id: "SH2", name: "B" },
  { id: "SH3", name: "C" },
  { id: "SH41", name: "G" },
];

const CAUSE_OF_INCIDENT: IOptionList[] = [
  { id: "IN1", name: "Struck by Object" },
  { id: "IN10", name: "Fall of objects" },
  { id: "IN11", name: "Caught in between" },
  { id: "IN12", name: "Unsafe Posture / Position" },
  { id: "IN13", name: "Defective tools / Wrong tools" },
  { id: "IN14", name: "Failure of tools &amp; tackles" },
  { id: "IN15", name: "Failure to follow safety norms" },
  { id: "IN16", name: "Exposure to or Contact with Extreme Temparature" },
  {
    id: "IN17",
    name: "Exposure to or Contact with Harmful Substances, Including Radiations",
  },
  { id: "IN18", name: "Foreign body in eye" },
  { id: "IN19", name: "Welding Spatters" },
  { id: "IN2", name: "Crashed Between" },
  { id: "IN20", name: "Spillage" },
  { id: "IN21", name: "Others" },
  { id: "IN23", name: "Motorcycle Skidding" },
  { id: "IN24", name: "Injury due to knife" },
  { id: "IN3", name: "Collision (Vehicle)" },
  { id: "IN4", name: "Electrical" },
  { id: "IN5", name: "Leaks, Spills and Gas release" },
  { id: "IN6", name: "Fire and Explosions" },
  { id: "IN7", name: "Process Deviation" },
  { id: "IN8", name: "Slip, Trip, Fall" },
  { id: "IN9", name: "Fall from height" },
];

const WCQ_LEVELS: IOptionList[] = [
  { id: "WCQ Level 1", name: "WCQ Level 1" },
  { id: "WCQ Level 2", name: "WCQ Level 2" },
  { id: "WCQ Level 3", name: "WCQ Level 3" },
  { id: "WCQ Level 4", name: "WCQ Level 4" },
  { id: "WCQ Level 5", name: "WCQ Level 5" },
];

const STATIONS: IOptionList[] = [
  { id: "STN_01", name: "STATION 01" },
  { id: "STN_02", name: "STATION 02" },
  { id: "STN_03", name: "STATION 03" },
  { id: "STN_04", name: "STATION 04" },
  { id: "STN_05", name: "STATION 05" },
  { id: "STN_06", name: "STATION 06" },
  { id: "STN_07", name: "STATION 07" },
  { id: "STN_08", name: "STATION 08" },
  { id: "STN_09", name: "STATION 09" },
  { id: "STN_10", name: "STATION 10" },
  { id: "STN_11", name: "STATION 11" },
  { id: "STN_12", name: "STATION 12" },
  { id: "STN_13", name: "STATION 13" },
  { id: "STN_14", name: "STATION 14" },
  { id: "STN_15", name: "STATION 15" },
  { id: "STN_16", name: "STATION 16" },
  { id: "STN_17", name: "STATION 17" },
  { id: "STN_18", name: "STATION 18" },
  { id: "STN_19", name: "STATION 19" },
  { id: "STN_20", name: "STATION 20" },
  { id: "STN_21", name: "STATION 21" },
  { id: "STN_22", name: "STATION 22" },
  { id: "STN_23", name: "STATION 23" },
  { id: "STN_24", name: "STATION 24" },
  { id: "STN_25", name: "STATION 25" },
  { id: "STN_26", name: "STATION 26" },
  { id: "STN_27", name: "STATION 27" },
  { id: "STN_28", name: "STATION 28" },
  { id: "STN_29", name: "STATION 29" },
  { id: "STN_30", name: "STATION 30" },
  { id: "STN_31", name: "STATION 31" },
  { id: "STN_32", name: "STATION 32" },
  { id: "STN_33", name: "STATION 33" },
  { id: "STN_34", name: "STATION 34" },
  { id: "STN_35", name: "STATION 35" },
  { id: "STN_36", name: "STATION 36" },
  { id: "STN_37", name: "STATION 37" },
  { id: "STN_38", name: "STATION 38" },
  { id: "STN_39", name: "STATION 39" },
  { id: "STN_40", name: "STATION 40" },
  { id: "STN_41", name: "STATION 41" },
  { id: "STN_42", name: "STATION 42" },
  { id: "STN_43", name: "STATION 43" },
  { id: "STN_44", name: "STATION 44" },
  { id: "STN_45", name: "STATION 45" },
  { id: "STN_46", name: "STATION 46" },
  { id: "STN_47", name: "STATION 47" },
  { id: "STN_48", name: "STATION 48" },
  { id: "STN_49", name: "STATION 49" },
  { id: "STN_50", name: "STATION 50" },
];
const SUGGESTION_CATEGORY: IOptionList[] = [
  { id: "", name: "All Category" },
  { id: "Safety", name: "Safety" },
  { id: "Energy Saving", name: "Energy Saving" },
  { id: "Others", name: "Others" },
  { id: "Maintenance", name: "Maintenance" },
  { id: "Quality", name: "Quality" },
  { id: "Pokayoke", name: "Pokayoke" },
  { id: "Productivity", name: "Productivity" },
  { id: "Cost", name: "Cost" },
  { id: "Morale", name: "Morale" },
  { id: "Environment", name: "Environment" },
  { id: "Administrative", name: "Administrative" },
  { id: "Improvement", name: "Improvement" },
  { id: "5S", name: "5S" },
];
const SUGGESTION_PERTAINING_CATEGORY: IOptionList[] = [
  { id: "PROCESS", name: "Process" },
  { id: "Vehicle Design", name: "Vehicle Design" },
];
const SUGGESTION_SCHEMES: IOptionList[] = [
  { id: "Normal", name: "Normal" },
  { id: "Special", name: "Special" },
  { id: "Implemented", name: "Implemented" },
  { id: "Special Implemented", name: "Special Implemented" },
];
const SUGGESTION_COMPANIES: IOptionList[] = [];
const SUGGESTION_DOCTYPE: IOptionList[] = [
  { id: "Before", name: "Before" },
  { id: "After", name: "After" },
];
const SUGGESTION_ACTION: IOptionList[] = [
  {
    id: "Send Suggestion To Coordinator",
    name: "Send Suggestion To Coordinator",
  },
  { id: "Send Suggestion To Evaluator", name: "Send Suggestion To Evaluator" },
  {
    id: "Send Suggestion To Suggestion Office",
    name: "Send Suggestion To Suggestion Office",
  },
];

const PTW_VIEW_STATS: IOptionList[] = [
  {
    id: "1",
    name: "Initiation",
  },
  {
    id: "2",
    name: "Initiation Review",
  },
  {
    id: "3",
    name: "Issue",
  },
  {
    id: "4",
    name: "Regular Check",
  },
  {
    id: "7",
    name: "Mark For Closure",
  },
  {
    id: "8",
    name: "Discard",
  },
  {
    id: "9",
    name: "Closed",
  },
  {
    id: "14",
    name: "Complete",
  },
  {
    id: "28",
    name: "Request Modification",
  },
  {
    id: "5",
    name: "Cancelation",
  },
  {
    id: "2,3,4,7,9",
    name: "Open",
  },
];
export {
  BASENAME,
  API_BASE_URL,
  ASSET_BASE_URL,
  ENV_MODE,
  CRYPTO_KEY,
  DEFUALT_VALUE_ALLLOCATION,
  DEFAULT_VALUE_ALLDIVISION,
  DEFAULT_VALUE_ALLAREA,
  DEFAULT_VALUE_ALLTEAM,
  DEFAULT_VALUE_ALLTEAM_MEMBER,
  DEFAULT_VALUE_LOCATION,
  DEFAULT_VALUE_DIVISION,
  DEFAULT_VALUE_AREA,
  DEFAULT_VALUE_TEAM,
  DEFAULT_VALUE_TEAM_MEMBER,
  OBS_CATEGORY_LIST,
  OBS_SEVERITY_LIST,
  OBS_STATUS_LIST,
  FY_MONTH_LIST,
  MONTH_4WEEK_LIST,
  MONTH_5WEEK_LIST,
  DAILY_SHIFTS,
  DAILY_SHIFTS_INCIDENT,
  CAUSE_OF_INCIDENT,
  EMP_TYPE,
  WCQ_LEVELS,
  STATIONS,
  WIS_BASE_URL,
  INS_SEVERITY_LIST,
  WIS_DATA_URL,
  QC_PDF_URL,
  QC_REPORT_URL,
  SUGGESTION_CATEGORY,
  SUGGESTION_PERTAINING_CATEGORY,
  SUGGESTION_SCHEMES,
  SUGGESTION_COMPANIES,
  SUGGESTION_DOCTYPE,
  SUGGESTION_ACTION,
  ITEM_STATUS_LIST,
  PTW_VIEW_STATS,
  SOCKET_BASE_URL,
  ISSUE_TRACKING_URL,
};
