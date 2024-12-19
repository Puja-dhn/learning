interface IUserFilter {
  ID: number | null;
  EMP_ID: string;
  EMP_NAME: string;
  BASE_LOCN_ID: number;
  EMAIL: string;
  PERSONNEL_SUBAREA: string;
  SAP_STATUS: string;
  EMP_TYPE: string;
  USERNAME: string;
  GRADE: string;
  SHOW_ADMIN_COL: number;
  SHOW_ROLES: number;
  IN_ROLE: number;
  IN_ROLE_LIST: number[];
  IN_MAPPING: number;
  IN_MAPPING_LIST: string[];
  ALLOWED_DOMAIN_LOGIN: string;
  IS_FILTER_QUERY: number;
}

export default IUserFilter;
