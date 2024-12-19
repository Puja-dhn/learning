const oracledb = require("oracledb");
const database = require("../services/database.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const http = require("http");
const https = require("https");

const SAP_MOR_USER_API = process.env.NODE_SAP_MOR_USER_API;

exports.getUserDBList = async (req, res) => {
  const { ID } = req.user;
  let resultLocations = await database
    .simpleQuery(
      `SELECT
        t1.id,
        t1.name       
    FROM
        t_sdt_locations t1,
        t_frm_user_location t2
    WHERE
            t1.id = t2.loc_id
        AND
            t1.status = 'Active'
        AND
            t2.user_id = :logged_user_id
    ORDER BY t1.name ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultLocations ||
    resultLocations.errorMessage ||
    !resultLocations.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultAllLocations = await database
    .simpleQuery(
      `SELECT
            t1.id,
            t1.name       
        FROM
            t_sdt_locations t1            
        WHERE
                t1.status = 'Active'            
        ORDER BY t1.name ASC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultAllLocations ||
    resultAllLocations.errorMessage ||
    !resultAllLocations.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultSubAreas = await database
    .simpleQuery(
      `SELECT DISTINCT
            personnel_subarea name
        FROM
            t_frm_users
        ORDER BY personnel_subarea ASC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultSubAreas || resultSubAreas.errorMessage || !resultSubAreas.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultSapStatus = await database
    .simpleQuery(
      `SELECT DISTINCT
          sap_status name
        FROM
            t_frm_users
        ORDER BY sap_status ASC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultSapStatus ||
    resultSapStatus.errorMessage ||
    !resultSapStatus.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultEmpType = await database
    .simpleQuery(
      `SELECT DISTINCT
          emp_type name
        FROM
            t_frm_users
        ORDER BY emp_type ASC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultEmpType || resultEmpType.errorMessage || !resultEmpType.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultGrade = await database
    .simpleQuery(
      `SELECT DISTINCT
          grade name
        FROM
            t_frm_users
        ORDER BY grade ASC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultGrade || resultGrade.errorMessage || !resultGrade.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultRoles = await database
    .simpleQuery(
      `SELECT
            id,
            name
        FROM
            t_frm_roles
        WHERE
            status = 'Active'
        ORDER BY name DESC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultRoles || resultRoles.errorMessage || !resultRoles.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res.status(200).json({
    allLocnList: [
      ...resultAllLocations.rows.map((item) => ({
        id: item.ID,
        name: item.NAME,
      })),
    ],
    locnList: [
      ...resultLocations.rows.map((item) => ({ id: item.ID, name: item.NAME })),
    ],
    subAreaList: [
      ...resultSubAreas.rows.map((item) => ({
        id: item.NAME,
        name: item.NAME,
      })),
    ],
    sapStatusList: [
      ...resultSapStatus.rows.map((item) => ({
        id: item.NAME,
        name: item.NAME,
      })),
    ],
    empTypeList: [
      ...resultEmpType.rows.map((item) => ({ id: item.NAME, name: item.NAME })),
    ],
    gradeList: [
      ...resultGrade.rows.map((item) => ({
        id: item.NAME,
        name: item.NAME,
      })),
    ],
    roleList: [
      ...resultRoles.rows.map((item) => ({
        id: item.ID,
        name: item.NAME,
      })),
    ],
    mappingList: [
      { id: "SDT Member", name: "SDT Member" },
      { id: "Group Leader", name: "Group Leader" },
      { id: "Team Leader", name: "Team Leader" },
      { id: "Point Leader (Safety)", name: "Point Leader (Safety)" },
      { id: "Point Leader (Quality)", name: "Point Leader (Quality)" },
      {
        id: "Point Leader (Productivity)",
        name: "Point Leader (Productivity)",
      },
      { id: "Point Leader (Delivery)", name: "Point Leader (Delivery)" },
      { id: "Point Leader (Cost)", name: "Point Leader (Cost)" },
      { id: "Point Leader (Morale)", name: "Point Leader (Morale)" },
      { id: "Point Leader (Environment)", name: "Point Leader (Environment)" },
      { id: "Division Head", name: "Division Head" },
      { id: "Area Incharge", name: "Area Incharge" },
      { id: "Factory Coordinator", name: "Factory Coordinator" },
      { id: "Factory Head", name: "Factory Head" },
    ],
  });
};

exports.getUserList = async (req, res) => {
  const { inputText, limitType, teamId, locnId } = req.body;
  let limitQuery = "";
  if (limitType && limitType === "TeamMember" && teamId && teamId > 0) {
    limitQuery = ` AND (t2.member_id IS NULL OR t2.team_id = ${teamId} ) `;
  }
  let resultUserList = await database
    .simpleQuery(
      `SELECT * FROM(SELECT DISTINCT
          t1.id,
          INITCAP(t1.name)||' ('||t1.emp_id||') - '||personnel_subarea name
      FROM
          t_frm_users t1,
          (select distinct member_id, team_id from t_sdt_team_member where trunc(effect_to) > trunc(sysdate) ) t2 
      WHERE
            t1.sap_status <> 'Inactive'
            AND t1.base_loc = ${locnId}
          AND
            t1.id = t2.member_id(+)
          AND 
            (
              LOWER(t1.name) like '%${inputText.toLowerCase()}%'
              OR
              LOWER(t1.emp_id) like '%${inputText.toLowerCase()}%'
            ) 
            ${limitQuery}
      ORDER BY
      INITCAP(t1.name)||' ('||t1.emp_id||') - '||personnel_subarea ASC) WHERE rownum <=500`,
      {}
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res
    .status(200)
    .json([
      ...resultUserList.rows.map((item) => ({ id: item.ID, name: item.NAME })),
    ]);
};

exports.getTeamUserList = async (req, res) => {
  const { inputText, teamId } = req.body;

  let resultUserList = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.id,
          INITCAP(t1.name)||' ('||t1.emp_id||') - '||personnel_subarea name
      FROM
          t_frm_users t1,
          t_sdt_team_member t2 
      WHERE
            t1.sap_status <> 'Inactive'
          AND
            t1.id = t2.member_id
          AND
            t2.team_id = :curr_team_id 
          AND
            TRUNC(sysdate) BETWEEN TRUNC(t2.effect_from) AND TRUNC(t2.effect_to)
          AND 
            (
              LOWER(t1.name) like '%${inputText.toLowerCase()}%'
              OR
              LOWER(t1.emp_id) like '%${inputText.toLowerCase()}%'
            )             
      ORDER BY
      INITCAP(t1.name)||' ('||t1.emp_id||') - '||personnel_subarea ASC`,
      {
        curr_team_id: {
          dir: oracledb.BIND_IN,
          val: teamId,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res
    .status(200)
    .json([
      ...resultUserList.rows.map((item) => ({ id: item.ID, name: item.NAME })),
    ]);
};

exports.getUserDetailsList = async (req, res) => {
  const { filterTicketNo, filterLocation, filterList } = req.body;
  const {
    ID,
    EMP_ID,
    EMP_NAME,
    BASE_LOCN_ID,
    EMAIL,
    PERSONNEL_SUBAREA,
    SAP_STATUS,
    EMP_TYPE,
    USERNAME,
    GRADE,
    SHOW_ADMIN_COL,
    SHOW_ROLES,
    IN_ROLE,
    IN_ROLE_LIST,
    IN_MAPPING,
    IN_MAPPING_LIST,
    ALLOWED_DOMAIN_LOGIN,
    IS_FILTER_QUERY,
  } = filterList;

  let result = [];
  let resultSDT = [];

  let strSql = "";
  let strSqlSDT = "";

  let strSqlAdminCol = ` '' mobile,
                          '' username,
                          '' grade,
                          '' designation,                          
                          '' rfid,
                          '' allowed_domain_login `;

  let strSqlRolesCol = ` '' roles `;

  if (SHOW_ADMIN_COL) {
    strSqlAdminCol = ` t1.mobile,
                        t1.username,
                        t1.grade,
                        t1.designation,                       
                        t1.rfid,
                        DECODE(t1.allowed_domain_login,1,'Yes','No') allowed_domain_login `;
  }

  if (SHOW_ROLES || IN_ROLE_LIST.length > 0) {
    strSqlRolesCol = `  nvl(
                              (
                                  SELECT
                                      LISTAGG(t3.name
                                      || ' ('
                                      || t3.id
                                      || ')',', ') WITHIN GROUP(ORDER BY t3.name
                                      || ' ('
                                      || t3.id
                                      || ')')
                                  FROM
                                      t_frm_roles t3,
                                      t_frm_user_role t4
                                  WHERE
                                          t3.id = t4.role_id
                                      AND
                                          t4.user_id = t1.id
                              ),
                              ''
                          ) roles `;
  }

  const isTicketNotNumber = isNaN(filterTicketNo);
  const strSqlForID = !isTicketNotNumber
    ? ` t1.id = ${filterTicketNo} OR `
    : ``;

  if (filterTicketNo.length > 0 && IS_FILTER_QUERY !== 1) {
    strSql = `SELECT
                t1.id,
                t1.emp_id,
                t1.name emp_name,
                t1.sap_status,
                t1.base_loc base_locn_id,
                t2.name base_locn_name,
                t1.personnel_subarea,
                t1.emp_type,
                t1.gender,
                NVL(t1.profile_pic_url,'profile_photo_default.png') profile_pic_url,
                t1.email,
                '' sdt_team_name,
                '' sdt_team_area,
                '' sdt_team_division, 
                ${strSqlAdminCol},
                ${strSqlRolesCol},
                nvl(
                    (
                        SELECT
                            LISTAGG(t7.loc_id
                            ,',') WITHIN GROUP(ORDER BY t7.loc_id)
                        FROM
                            t_frm_user_location t7
                        WHERE
                                t7.user_id = t1.id
                    ),
                    ''
                ) locations
              FROM
                t_frm_users t1,
                t_frm_locations t2
              WHERE
                t1.base_loc = t2.id
                AND 
                (
                  ${strSqlForID}   
                  t1.emp_id = '${filterTicketNo}'   OR
                  LOWER(t1.name) LIKE '%${filterTicketNo.toLowerCase()}%'   OR
                  LOWER(t1.email) LIKE '%${filterTicketNo.toLowerCase()}%'   
                )
                AND
                  t1.base_loc = '${filterLocation}'
              ORDER BY 
                emp_name, 
                emp_id ASC`;
    if (filterTicketNo.length > 0) {
      let resultUserList = await database
        .simpleQuery(strSql, {})
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultUserList || resultUserList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      result = [...resultUserList.rows];
    } else {
      result = [];
    }
    strSqlSDT = `SELECT
                      t1.id user_id,
                      t5.name team_name,
                      t7.tol_level_name area_name,
                      TRIM(
                          CASE
                              WHEN instr(t8.tol_level_name,'(') > 0 THEN substr(
                                  t8.tol_level_name,
                                  0,
                                  instr(t8.tol_level_name,'(') - 1
                              )
                              ELSE t8.tol_level_name
                          END
                      ) div_name
                  FROM
                      t_frm_users t1,
                      t_frm_locations t2,
                      t_sdt_team_master t5,
                      t_sdt_team_member t6,
                      t_sos_organisation_levels t7,
                      t_sos_organisation_levels t8
                  WHERE
                          t1.base_loc = t2.id
                      AND
                          t6.member_id = t1.id
                      AND
                          t6.team_id = t5.id
                      AND
                          t7.tol_level_id = t5.area_id
                      AND
                          t7.tol_mas_id = t8.tol_level_id 
                      AND 
                          trunc(SYSDATE) BETWEEN trunc(t6.effect_from) AND trunc(t6.effect_to) 
                      AND 
                          (
                            t1.emp_id = '${filterTicketNo}'   OR
                            LOWER(t1.name) LIKE '%${filterTicketNo.toLowerCase()}%'   OR
                            LOWER(t1.email) LIKE '%${filterTicketNo.toLowerCase()}%'   
                          )
                      AND
                          t1.base_loc = '${filterLocation}' `;

    if (filterTicketNo.length > 0) {
      let resultUserSDTList = await database
        .simpleQuery(strSqlSDT, {})
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultUserSDTList || resultUserSDTList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      resultSDT = [...resultUserSDTList.rows];
    } else {
      resultSDT = [];
    }
  } else {
    if (IS_FILTER_QUERY) {
      let strID = ID > 0 ? ` AND t1.id = ${ID}  ` : ``;
      let strEmpID = EMP_ID.length > 0 ? ` AND t1.emp_id = '${EMP_ID}'  ` : ``;
      let strEmpName =
        EMP_NAME.length > 0
          ? ` AND LOWER(t1.name) LIKE '%${EMP_NAME.toLowerCase()}%'  `
          : ``;
      let strBaseLocnID =
        BASE_LOCN_ID > 0 ? ` AND t1.base_loc = '${BASE_LOCN_ID}'  ` : ``;
      let strEmail =
        EMAIL.length > 0
          ? ` AND LOWER(t1.email) LIKE '%${EMAIL.toLowerCase()}%'  `
          : ``;
      let strPersonnelSubArea =
        PERSONNEL_SUBAREA != "All"
          ? ` AND LOWER(t1.personnel_subarea) = LOWER('${PERSONNEL_SUBAREA}')  `
          : ``;
      let strSapStatus =
        SAP_STATUS != "All" ? ` AND t1.sap_status = '${SAP_STATUS}'  ` : ``;
      let strEmpType =
        EMP_TYPE != "All" ? ` AND t1.emp_type = '${EMP_TYPE}'  ` : ``;
      let strUserName =
        USERNAME.length > 0
          ? ` AND LOWER(t1.username) LIKE '%${USERNAME.toLowerCase()}%'  `
          : ``;
      let strGrade = GRADE != "All" ? ` AND t1.grade = '${GRADE}'  ` : ``;
      let strAllowedDomainLogin =
        ALLOWED_DOMAIN_LOGIN != "All"
          ? ` AND NVL(t1.ALLOWED_DOMAIN_LOGIN,0) = ${ALLOWED_DOMAIN_LOGIN}  `
          : ``;

      strSql = `SELECT
                t1.id,
                t1.emp_id,
                t1.name emp_name,
                t1.sap_status,
                t1.base_loc base_locn_id,
                t2.name base_locn_name,
                t1.personnel_subarea,
                t1.emp_type,
                t1.gender,
                NVL(t1.profile_pic_url,'profile_photo_default.png') profile_pic_url,
                t1.email,
                '' sdt_team_name,
                '' sdt_team_area,
                '' sdt_team_division,                
                ${strSqlAdminCol},
                ${strSqlRolesCol},
                nvl(
                    (
                        SELECT
                            LISTAGG(t7.loc_id
                            ,',') WITHIN GROUP(ORDER BY t7.loc_id)
                        FROM
                            t_frm_user_location t7
                        WHERE
                                t7.user_id = t1.id
                    ),
                    ''
                ) locations
              FROM
                t_frm_users t1,
                t_frm_locations t2
              WHERE
                t1.base_loc = t2.id 
                ${strID}
                ${strEmpID}
                ${strEmpName}
                ${strBaseLocnID}
                ${strEmail}
                ${strPersonnelSubArea}
                ${strSapStatus}
                ${strEmpType}
                ${strUserName}
                ${strGrade}
                ${strAllowedDomainLogin}
              ORDER BY 
                emp_name, 
                emp_id ASC`;

      let resultUserList = await database
        .simpleQuery(strSql, {})
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultUserList || resultUserList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      result = [...resultUserList.rows];

      strSqlSDT = `SELECT
                      t1.id user_id,
                      t5.name team_name,
                      t7.tol_level_name area_name,
                      TRIM(
                          CASE
                              WHEN instr(t8.tol_level_name,'(') > 0 THEN substr(
                                  t8.tol_level_name,
                                  0,
                                  instr(t8.tol_level_name,'(') - 1
                              )
                              ELSE t8.tol_level_name
                          END
                      ) div_name
                  FROM
                      t_frm_users t1,
                      t_frm_locations t2,
                      t_sdt_team_master t5,
                      t_sdt_team_member t6,
                      t_sos_organisation_levels t7,
                      t_sos_organisation_levels t8
                  WHERE
                          t1.base_loc = t2.id
                      AND
                          t6.member_id = t1.id
                      AND
                          t6.team_id = t5.id
                      AND
                          t7.tol_level_id = t5.area_id
                      AND
                          t7.tol_mas_id = t8.tol_level_id 
                      AND 
                          trunc(SYSDATE) BETWEEN trunc(t6.effect_from) AND trunc(t6.effect_to) 
                        ${strID}
                        ${strEmpID}
                        ${strEmpName}
                        ${strBaseLocnID}
                        ${strEmail}
                        ${strPersonnelSubArea}
                        ${strSapStatus}
                        ${strEmpType}
                        ${strUserName}
                        ${strGrade}
                        ${strAllowedDomainLogin} `;

      let resultUserSDTList = await database
        .simpleQuery(strSqlSDT, {})
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultUserSDTList || resultUserSDTList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      resultSDT = [...resultUserSDTList.rows];
    } else {
      result = [];
      resultSDT = [];
    }
  }

  // get data for in mapping filter

  let arrSDTGroupLeaders = [];
  let arrSDTTeamLeaders = [];
  let arrSDTPointLeaderSafety = [];
  let arrSDTPointLeaderQuality = [];
  let arrSDTPointLeaderProductivity = [];
  let arrSDTPointLeaderDelivery = [];
  let arrSDTPointLeaderCost = [];
  let arrSDTPointLeaderMorale = [];
  let arrSDTPointLeaderEnvironment = [];
  let arrSDTTeamMembers = [];

  let arrDivisionHeads = [];
  let arrAreaIncharges = [];
  let arrFicHeads = [];
  let arrFicAdmins = [];

  if (IN_MAPPING_LIST.length > 0) {
    if (
      IN_MAPPING_LIST.includes("SDT Member") ||
      IN_MAPPING_LIST.includes("Group Leader") ||
      IN_MAPPING_LIST.includes("Team Leader") ||
      IN_MAPPING_LIST.includes("Point Leader (Safety)") ||
      IN_MAPPING_LIST.includes("Point Leader (Quality)") ||
      IN_MAPPING_LIST.includes("Point Leader (Productivity)") ||
      IN_MAPPING_LIST.includes("Point Leader (Delivery)") ||
      IN_MAPPING_LIST.includes("Point Leader (Cost)") ||
      IN_MAPPING_LIST.includes("Point Leader (Morale)") ||
      IN_MAPPING_LIST.includes("Point Leader (Environment)")
    ) {
      let resultSDTMemberList = await database
        .simpleQuery(
          `SELECT
                role_type,
                member_id
            FROM
                t_sdt_team_member
            WHERE
                trunc(SYSDATE) BETWEEN trunc(effect_from) AND trunc(effect_to) `,
          {}
        )
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultSDTMemberList || resultSDTMemberList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      if (resultSDTMemberList.rows.length > 0) {
        arrSDTGroupLeaders = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 1)
          .map((item) => item.MEMBER_ID);
        arrSDTTeamLeaders = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 2)
          .map((item) => item.MEMBER_ID);
        arrSDTPointLeaderSafety = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 3)
          .map((item) => item.MEMBER_ID);
        arrSDTPointLeaderQuality = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 4)
          .map((item) => item.MEMBER_ID);
        arrSDTPointLeaderProductivity = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 5)
          .map((item) => item.MEMBER_ID);
        arrSDTPointLeaderDelivery = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 6)
          .map((item) => item.MEMBER_ID);
        arrSDTPointLeaderCost = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 7)
          .map((item) => item.MEMBER_ID);
        arrSDTPointLeaderMorale = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 8)
          .map((item) => item.MEMBER_ID);
        arrSDTPointLeaderEnvironment = resultSDTMemberList.rows
          .filter((member) => member.ROLE_TYPE === 9)
          .map((item) => item.MEMBER_ID);
        arrSDTTeamMembers = resultSDTMemberList.rows.filter(
          (member) => member.ROLE_TYPE === 10
        );
      }
    }

    if (IN_MAPPING_LIST.includes("Factory Head")) {
      let resultFactoryHeadList = await database
        .simpleQuery(
          `SELECT DISTINCT
                t2.id
            FROM
                t_stp_factory t1,
                t_frm_users t2
            WHERE
                    t1.tfy_act_flg = 'Active'
                AND
                    t2.emp_id = t1.tfy_head`,
          {}
        )
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultFactoryHeadList || resultFactoryHeadList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      if (resultFactoryHeadList.rows.length > 0) {
        arrFicHeads = [...resultFactoryHeadList.rows].map((item) => item.ID);
      }
    }

    if (IN_MAPPING_LIST.includes("Division Head")) {
      let resultDivisionHeadList = await database
        .simpleQuery(
          `SELECT DISTINCT
                t2.id
            FROM
                t_sos_organisation_levels t1,
                t_frm_users t2
            WHERE
                    t1.tol_level = 2
                AND
                    t1.tol_act_flg = 'Active'
                AND
                    t2.emp_id = t1.tol_has_head`,
          {}
        )
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultDivisionHeadList || resultDivisionHeadList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      if (resultDivisionHeadList.rows.length > 0) {
        arrDivisionHeads = [...resultDivisionHeadList.rows].map(
          (item) => item.ID
        );
      }
    }

    if (IN_MAPPING_LIST.includes("Area Incharge")) {
      let resultAreaInchargeList = await database
        .simpleQuery(
          `SELECT DISTINCT
                t2.id
            FROM
                t_sos_organisation_levels t1,
                t_frm_users t2
            WHERE
                    t1.tol_level = 3
                AND
                    t1.tol_act_flg = 'Active'
                AND
                    t2.emp_id = t1.tol_has_head`,
          {}
        )
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultAreaInchargeList || resultAreaInchargeList.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      if (resultAreaInchargeList.rows.length > 0) {
        arrAreaIncharges = [...resultAreaInchargeList.rows].map(
          (item) => item.ID
        );
      }
    }

    if (IN_MAPPING_LIST.includes("Factory Coordinator")) {
      let resultFicAdmins = await database
        .simpleQuery(
          `SELECT 
                member_id
            FROM
                t_sdt_fic_admins `,
          {}
        )
        .catch((err) => {
          console.log("1", err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });

      if (!resultFicAdmins || resultFicAdmins.errorMessage) {
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }

      if (resultFicAdmins.rows.length > 0) {
        arrFicAdmins = [...resultFicAdmins.rows].map((item) => item.MEMBER_ID);
      }
    }

    // filter

    result = result.filter((user) => {
      if (IN_MAPPING == "1") {
        return (
          (IN_MAPPING_LIST.includes("SDT Member") &&
            arrSDTTeamMembers.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Group Leader") &&
            arrSDTGroupLeaders.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Team Leader") &&
            arrSDTTeamLeaders.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Point Leader (Safety)") &&
            arrSDTPointLeaderSafety.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Point Leader (Quality)") &&
            arrSDTPointLeaderQuality.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Point Leader (Productivity)") &&
            arrSDTPointLeaderProductivity.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Point Leader (Delivery)") &&
            arrSDTPointLeaderDelivery.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Point Leader (Cost)") &&
            arrSDTPointLeaderCost.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Point Leader (Morale)") &&
            arrSDTPointLeaderMorale.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Point Leader (Environment)") &&
            arrSDTPointLeaderEnvironment.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Factory Head") &&
            arrFicHeads.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Division Head") &&
            arrDivisionHeads.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Area Incharge") &&
            arrAreaIncharges.includes(user.ID)) ||
          (IN_MAPPING_LIST.includes("Factory Coordinator") &&
            arrFicAdmins.includes(user.ID))
        );
      } else {
        return (
          !(
            IN_MAPPING_LIST.includes("SDT Member") &&
            arrSDTTeamMembers.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Group Leader") &&
            arrSDTGroupLeaders.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Team Leader") &&
            arrSDTTeamLeaders.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Point Leader (Safety)") &&
            arrSDTPointLeaderSafety.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Point Leader (Quality)") &&
            arrSDTPointLeaderQuality.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Point Leader (Productivity)") &&
            arrSDTPointLeaderProductivity.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Point Leader (Delivery)") &&
            arrSDTPointLeaderDelivery.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Point Leader (Cost)") &&
            arrSDTPointLeaderCost.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Point Leader (Morale)") &&
            arrSDTPointLeaderMorale.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Point Leader (Environment)") &&
            arrSDTPointLeaderEnvironment.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Factory Head") &&
            arrFicHeads.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Division Head") &&
            arrDivisionHeads.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Area Incharge") &&
            arrAreaIncharges.includes(user.ID)
          ) &&
          !(
            IN_MAPPING_LIST.includes("Factory Coordinator") &&
            arrFicAdmins.includes(user.ID)
          )
        );
      }
    });
  }

  // check roles

  if (IN_ROLE_LIST.length > 0) {
    result = result.filter((user) => {
      if (IN_ROLE == "1") {
        let hasRole = false;
        for (let iRole = 0; iRole < IN_ROLE_LIST.length; iRole++) {
          if (user.ROLES && user.ROLES.includes(`${IN_ROLE_LIST[iRole]}`)) {
            hasRole = true;
          }
        }
        return hasRole;
      } else {
        let hasRole = true;
        for (let iRole = 0; iRole < IN_ROLE_LIST.length; iRole++) {
          if (user.ROLES && user.ROLES.includes(`${IN_ROLE_LIST[iRole]}`)) {
            hasRole = false;
          }
        }
        return hasRole;
      }
    });
  }

  // get sdt teams data

  for (let i = 0; i < result.length; i++) {
    const currSDTTeams = resultSDT.filter(
      (item) => item.USER_ID === result[i].ID
    );
    let currSDTTeamName = "";
    let currSDTTeamAreaName = "";
    let currSDTTeamDivName = "";
    if (currSDTTeams.length > 0) {
      currSDTTeamName = Array.from(
        new Set(currSDTTeams.map((item) => item.TEAM_NAME))
      ).join(", ");
      currSDTTeamAreaName = Array.from(
        new Set(currSDTTeams.map((item) => item.AREA_NAME))
      ).join(", ");
      currSDTTeamDivName = Array.from(
        new Set(currSDTTeams.map((item) => item.DIV_NAME))
      ).join(", ");
    }

    result[i].SDT_TEAM_NAME = currSDTTeamName;
    result[i].SDT_TEAM_AREA = currSDTTeamAreaName;
    result[i].SDT_TEAM_DIVISION = currSDTTeamDivName;

    // reset Role based on role flag

    if (!SHOW_ROLES) {
      result[i].ROLES = "";
    }
  }

  res.status(200).json([...result]);
};

exports.updateUserDetails = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isEditAllowed = ROLES && ROLES.length > 0 && ROLES.includes(2);
  const {
    IS_RFID_RESET,
    IS_PASSWORD_RESET,
    NEW_PASSWORD,
    ID,
    EMP_ID,
    EMP_NAME,
    BASE_LOCN_ID,
    EMAIL,
    ROLES: USER_ROLES,
    ALLOWED_DOMAIN_LOGIN,
    LOCATIONS: USER_LOCATIONS,
    IS_PROFILE_EDIT,
  } = req.body;

  if (!ID || ID.length <= 0) {
    return res.status(400).json({
      errorMessage: "Invalid Request",
      errorTransKey: "api_res_invalid_request",
    });
  }

  if (!isEditAllowed) {
    return res.status(403).json({
      errorMessage: "You are not authorized to update Data",
      errorTransKey: "api_res_unathorized_update_data",
    });
  }

  // update user details, if rfid is reset, if password is reset

  let strSqlRFID = "";
  let strSqlPass = "";
  let strSqlImage = "";

  if (IS_RFID_RESET.toString() === "1") {
    strSqlRFID = ` rfid = null, `;
  }

  if (IS_PASSWORD_RESET.toString() === "1") {
    strSqlPass = ` password = '${NEW_PASSWORD}', `;
  }

  if (IS_PROFILE_EDIT.toString() === "1") {
    strSqlImage = ` profile_pic_url = '${EMP_ID}.JPG', `;
  }

  let resultUpdateUserDetails = await database
    .simpleQuery(
      `UPDATE
          t_frm_users  
        SET          
          name = :curr_emp_name,
          email = :curr_email,
          base_loc = :curr_base_loc,
          allowed_domain_login = :curr_allowed_domain_login,
          ${strSqlRFID} 
          ${strSqlPass}
          ${strSqlImage} 
          upd_by = :logged_user_id,
          upd_ts = SYSDATE
        WHERE
            id = :curr_id `,
      {
        curr_emp_name: {
          dir: oracledb.BIND_IN,
          val: EMP_NAME,
          type: oracledb.STRING,
        },
        curr_email: {
          dir: oracledb.BIND_IN,
          val: EMAIL,
          type: oracledb.STRING,
        },
        curr_base_loc: {
          dir: oracledb.BIND_IN,
          val: BASE_LOCN_ID.toString(),
          type: oracledb.STRING,
        },
        curr_allowed_domain_login: {
          dir: oracledb.BIND_IN,
          val: +ALLOWED_DOMAIN_LOGIN,
          type: oracledb.NUMBER,
        },
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: logged_user_id,
          type: oracledb.NUMBER,
        },
        curr_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUpdateUserDetails || resultUpdateUserDetails.errorMessage) {
    return res.status(400).json({
      errorMessage: resultUpdateUserDetails.errorMessage,
      errorTransKey: resultUpdateUserDetails.errorTransKey,
    });
  }

  if (IS_PROFILE_EDIT.toString() === "1") {
    const imageDirPath = path.resolve(
      __dirname,
      "../static/api/images/profile/"
    );
    fs.rename(
      `${imageDirPath}/${EMP_ID}_temp.JPG`,
      `${imageDirPath}/${EMP_ID}.JPG`,
      (err) => {
        if (err) console.log("ERROR renaming profile pic: " + err);
      }
    );
  }

  console.log("UPDATED User Details Data ", resultUpdateUserDetails);

  // delete old roles

  let resultDeleteOldRoles = await database
    .simpleQuery(
      `DELETE          
          t_frm_user_role
      WHERE
          user_id = :curr_id `,
      {
        curr_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultDeleteOldRoles || resultDeleteOldRoles.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  // add new roles

  let resultRoles = await database
    .simpleQuery(
      `SELECT
          id,
          name
      FROM
          t_frm_roles
      WHERE
          status = 'Active'
      ORDER BY name DESC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultRoles || resultRoles.errorMessage || !resultRoles.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  const strRoles = USER_ROLES;
  let arrRoles = [];
  if (strRoles.length > 0) {
    arrRoles = strRoles.split(", ");
  }
  arrRoles = arrRoles.map(
    (item) =>
      resultRoles.rows.filter((role) => item === `${role.NAME} (${role.ID})`)[0]
        .ID
  );

  for (let i = 0; i < arrRoles.length; i += 1) {
    let resultInsertUserRole = await database
      .simpleQuery(
        `INSERT INTO 
          t_frm_user_role 
        (
          user_id,
          role_id
        )
        values
        (
          :curr_id,
          :curr_role_id    
        )`,
        {
          curr_id: {
            dir: oracledb.BIND_IN,
            val: ID,
            type: oracledb.NUMBER,
          },
          curr_role_id: {
            dir: oracledb.BIND_IN,
            val: arrRoles[i],
            type: oracledb.NUMBER,
          },
        }
      )
      .catch((err) => {
        console.log(err);
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });

    if (!resultInsertUserRole || resultInsertUserRole.errorMessage) {
      return res.status(400).json({
        errorMessage: resultInsertUserRole.errorMessage,
        errorTransKey: resultInsertUserRole.errorTransKey,
      });
    }

    console.log("INSERTED New Roles ", resultInsertUserRole);
  }

  // delete old roles

  let resultDeleteOldLocations = await database
    .simpleQuery(
      `DELETE          
            t_frm_user_location
        WHERE
            user_id = :curr_id `,
      {
        curr_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultDeleteOldLocations || resultDeleteOldLocations.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  // add user locations

  let arrLocations = USER_LOCATIONS.split(",");

  for (let i = 0; i < arrLocations.length; i += 1) {
    let resultInsertUserLocation = await database
      .simpleQuery(
        `INSERT INTO 
        t_frm_user_location 
      (
        user_id,
        loc_id
      )
      values
      (
        :curr_id,
        :curr_loc_id    
      )`,
        {
          curr_id: {
            dir: oracledb.BIND_IN,
            val: ID,
            type: oracledb.NUMBER,
          },
          curr_loc_id: {
            dir: oracledb.BIND_IN,
            val: +arrLocations[i],
            type: oracledb.NUMBER,
          },
        }
      )
      .catch((err) => {
        console.log(err);
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });

    if (!resultInsertUserLocation || resultInsertUserLocation.errorMessage) {
      return res.status(400).json({
        errorMessage: resultInsertUserLocation.errorMessage,
        errorTransKey: resultInsertUserLocation.errorTransKey,
      });
    }

    console.log("INSERTED New Locations ", resultInsertUserLocation);
  }

  return res.status(200).json("success");
};

exports.updateUserProfile = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const { ID, EMP_ID, IS_PROFILE_EDIT, MOBILE } = req.body;

  if (!ID || ID.length <= 0) {
    return res.status(400).json({
      errorMessage: "Invalid Request",
      errorTransKey: "api_res_invalid_request",
    });
  }

  let strSqlImage = "";

  if (IS_PROFILE_EDIT === 1) {
    strSqlImage = ` profile_pic_url = '${EMP_ID}.JPG', `;
  }

  let resultUpdateUserDetails = await database
    .simpleQuery(
      `UPDATE
          t_frm_users  
        SET          
          mobile =:curr_mobile_no,
          ${strSqlImage} 
          upd_by = :logged_user_id,
          upd_ts = SYSDATE
        WHERE
            id = :curr_id `,
      {
        curr_mobile_no: {
          dir: oracledb.BIND_IN,
          val: MOBILE,
          type: oracledb.STRING,
        },
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: logged_user_id,
          type: oracledb.NUMBER,
        },
        curr_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUpdateUserDetails || resultUpdateUserDetails.errorMessage) {
    return res.status(400).json({
      errorMessage: resultUpdateUserDetails.errorMessage,
      errorTransKey: resultUpdateUserDetails.errorTransKey,
    });
  }

  if (IS_PROFILE_EDIT === 1) {
    const imageDirPath = path.resolve(
      __dirname,
      "../static/api/images/profile/"
    );
    fs.rename(
      `${imageDirPath}/${EMP_ID}_temp.JPG`,
      `${imageDirPath}/${EMP_ID}.JPG`,
      (err) => {
        if (err) console.log("ERROR renaming profile pic: " + err);
      }
    );
  }
  console.log("UPDATED User Details Data ", resultUpdateUserDetails);
  return res.status(200).json("success");
};

exports.rectifyUserImages = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;

  const imageDirPath = path.resolve(__dirname, "../static/api/images/profile/");
  fs.readdir(imageDirPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function (file) {
      const arrDot = file.split(".");
      if (arrDot.length > 0) {
        const arrDash = arrDot[0].split("_");
        if (arrDash.length > 0) {
          const currFileName = arrDash[0];
          if (!isNaN(currFileName)) {
            const newFileName = parseInt(currFileName, 10);
            if (
              arrDot[0] !== newFileName.toString() ||
              arrDot[arrDot.length - 1] !== "JPG"
            ) {
              console.log(arrDot, newFileName);
              fs.rename(
                `${imageDirPath}/${file}`,
                `${imageDirPath}/${newFileName}.JPG`,
                (err) => {
                  if (err) console.log("ERROR renaming profile pic: " + err);
                }
              );
            }
          }
        }
      }
    });
  });
  console.log("User Images Rectified");
  return res.status(200).json("success");
};

exports.getUserTeamMapping = async (req, res) => {
  const { inputText, teamId } = req.body;

  let resultUserList = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.id,
          t2.team_id,
          t3.NAME team_name,
          t4.tol_level_name area_name,
          t5.tol_level_name division_name,
          t7.tfy_fac_name fic,
          INITCAP(t1.name)||' ('||t1.emp_id||') - '||personnel_subarea name
      FROM
          t_frm_users t1,
          t_sdt_team_member t2,
          t_sdt_team_master t3,
          t_sos_organisation_levels t4,
          t_sos_organisation_levels t5,
          t_sos_ficdiv_map t6,
          t_stp_factory t7 
      WHERE
            t1.sap_status <> 'Inactive'
          AND
            t1.id = t2.member_id
          AND
            t2.TEAM_ID = t3.ID
            AND
            t3.area_id = t4.tol_level_id
        AND
            t4.tol_level = 3
        AND
            t4.tol_mas_id = t5.tol_level_id
        AND
            t5.tol_level = 2
        AND
            t4.tol_mas_id = t6.tfm_div_id
        AND
            t6.tfm_fic_id = t7.tfy_fac_id
          AND
            TRUNC(sysdate) BETWEEN TRUNC(t2.effect_from) AND TRUNC(t2.effect_to)
          AND 
            (
              LOWER(t1.name) like '%${inputText.toLowerCase()}%'
              OR
              LOWER(t1.emp_id) like '%${inputText.toLowerCase()}%'
            )             
      ORDER BY
      INITCAP(t1.name)||' ('||t1.emp_id||') - '||personnel_subarea ASC`
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (resultUserList.rows.length > 0) {
    res
      .status(200)
      .json(
        `Member is already mapped in "${resultUserList.rows[0].TEAM_NAME}" team under "${resultUserList.rows[0].AREA_NAME}" area and "${resultUserList.rows[0].DIVISION_NAME}" division`
      );
  } else {
    res.status(200).json("notInTeam");
  }
};

exports.checkValidUsers = async (req, res) => {
  const { inputText } = req.body;

  let resultUserList = await database
    .simpleQuery(
      `SELECT emp_id
      FROM
          t_frm_users t1
      WHERE
            t1.sap_status <> 'Inactive'
          AND
            t1.emp_id = ${inputText}
          `
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (resultUserList.rows.length > 0) {
    res.status(200).json(`valid`);
  } else {
    res.status(200).json("invalid");
  }
};
exports.getEmployeeType = async (req, res) => {
  const { ticketNo } = req.body;

  let resultUserList = await database
    .simpleQuery(
      `SELECT emp_type
      FROM
          t_frm_users t1
      WHERE
            t1.sap_status <> 'Inactive'
          AND
            t1.id = ${ticketNo}
          `
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (resultUserList.rows.length > 0) {
    res.status(200).json([resultUserList.rows[0]]);
  } else {
    res.status(200).json([]);
  }
};
exports.getInactiveUsersList = async (req, res) => {
  let userList = [];

  let resultUserList = await database
    .simpleQuery(
      `SELECT 
          t1.emp_id employee_id, 
          t1.name,
          nvl(t1.email, t2.email_id) email,
          nvl(t1.mobile, t2.mobile) mobile,
          TO_CHAR(t2.crt_ts,'YYYY-MM-DD') created_date,
          t2.status,
          t1.grade
        FROM 
          t_frm_users t1 
          join t_ngs_users t2 on t1.emp_id = t2.emp_id
        WHERE 
          1=1
        ORDER BY 
          t2.id DESC `,
      {}
    )
    .catch((err) => {
      console.log("Inactive User List - ", err);
      return {
        errorMessage: "Something went wrong",
      };
    });

  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
    });
  }

  userList = [
    ...resultUserList.rows.map((item) => ({
      EMPLOYEE_ID: item.EMPLOYEE_ID,
      NAME: item.NAME,
      EMAIL: item.EMAIL,
      MOBILE: item.MOBILE,
      DATE: item.CREATED_DATE,
      STATUS: item.STATUS,
      GRADE: item.GRADE,
    })),
  ];

  res.status(200).json({
    userList,
  });
};
exports.activateUser = async (req, res) => {
  const { employee_id } = req.body;
  let resultUpdateUser = await database
    .simpleQuery(
      `UPDATE t_ngs_users SET status='Active',upd_ts=SYSDATE where emp_id=${employee_id} `,
      {}
    )
    .catch((err) => {
      console.log("Activate User - ", err);
      return {
        errorMessage: "Something went wrong",
      };
    });

  if (!resultUpdateUser || resultUpdateUser.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
    });
  }
  let resultUser = await database
    .simpleQuery(
      `SELECT t1.id,t1.base_loc
      FROM
          t_frm_users t1
      WHERE
            t1.emp_id = '${employee_id}'`,
      {}
    )
    .catch((err) => {
      console.log(err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });
  if (!resultUser || resultUser.errorMessage || !resultUser.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  const frm_user_id = resultUser.rows[0].ID;
  const base_loc = resultUser.rows[0].BASE_LOC;

  let resultInsertUserRoles = await database
    .simpleQuery(
      `INSERT INTO 
              t_ngs_user_role
                (
                  user_id,
                  role_id
                )
                values
                (
                  :curr_user_id,
                  11
                )`,
      {
        curr_user_id: {
          dir: oracledb.BIND_IN,
          val: frm_user_id,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log(err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultInsertUserRoles || resultInsertUserRoles.errorMessage) {
    return res.status(400).json({
      errorMessage: resultInsertUserRoles.errorMessage,
      errorTransKey: resultInsertUserRoles.errorTransKey,
    });
  }

  //check user location access

  let checkLocation = await database
    .simpleQuery(
      `SELECT *
            FROM
                t_frm_user_location t1
            WHERE
                  t1.user_id = '${frm_user_id}'`,
      {}
    )
    .catch((err) => {
      console.log(err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });
  if (!checkLocation || checkLocation.errorMessage || !checkLocation.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (checkLocation.rows.length == 0) {
    let resultInsertUserLocation = await database
      .simpleQuery(
        `INSERT INTO 
              t_frm_user_location
                  (
                    user_id,
                    loc_id
                  )
                  values
                  (
                    :curr_user_id,
                    :curr_loc_id
                  )`,
        {
          curr_user_id: {
            dir: oracledb.BIND_IN,
            val: +frm_user_id,
            type: oracledb.NUMBER,
          },
          curr_loc_id: {
            dir: oracledb.BIND_IN,
            val: +base_loc,
            type: oracledb.NUMBER,
          },
        }
      )
      .catch((err) => {
        console.log(err);
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });

    if (!resultInsertUserLocation || resultInsertUserLocation.errorMessage) {
      return res.status(400).json({
        errorMessage:
          resultInseresultInsertUserLocationrtUserRoles.errorMessage,
        errorTransKey: resultInsertUserLocation.errorTransKey,
      });
    }
  }

  //     console.log("INSERTED SA USERS ROLES ", resultInsertUserRoles);

  return res.status(200).json("User Activate successfully");
};
